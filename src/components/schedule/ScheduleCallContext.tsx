"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import {
  BookingStep,
  BookingFormData,
  BookingFormErrors,
  ConfirmedBooking,
} from "@/types/booking";
import { bookingConfig } from "@/config/bookingConfig";
import { formatDateToIso, isDateSelectable } from "@/lib/bookingUtils";

interface ScheduleCallContextType {
  isOpen: boolean;
  openScheduleCall: (triggerElement?: HTMLElement | null) => void;
  closeScheduleCall: () => void;
  currentStep: BookingStep;
  setCurrentStep: (step: BookingStep) => void;
  formData: BookingFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingFormData>>;
  updateFormField: (field: keyof BookingFormData, value: string) => void;
  errors: BookingFormErrors;
  setErrors: React.Dispatch<React.SetStateAction<BookingFormErrors>>;
  isSubmitting: boolean;
  confirmedBooking: ConfirmedBooking | null;
  resetBooking: () => void;
  submitBooking: () => Promise<boolean>;
  validateStep1: () => boolean;
  validateStep2: () => boolean;
}

const defaultFormData: BookingFormData = {
  date: "",
  time: "",
  timezone: bookingConfig.timezone,
  fullName: "",
  mobileNumber: "",
  email: "",
  message: "",
  meetingType: bookingConfig.meetingType,
};

const ScheduleCallContext = createContext<ScheduleCallContextType | undefined>(undefined);

export function ScheduleCallProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [formData, setFormData] = useState<BookingFormData>(defaultFormData);
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<ConfirmedBooking | null>(null);

  // Store trigger element to restore focus when modal closes
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Pick initial default date (today if selectable, or next selectable day)
  const initializeDefaultDate = useCallback(() => {
    const today = new Date();
    if (isDateSelectable(today)) {
      return formatDateToIso(today);
    }
    // Try next few days
    for (let i = 1; i <= 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      if (isDateSelectable(nextDay)) {
        return formatDateToIso(nextDay);
      }
    }
    return formatDateToIso(today);
  }, []);

  const openScheduleCall = useCallback(
    (triggerElement?: HTMLElement | null) => {
      if (triggerElement) {
        triggerElementRef.current = triggerElement;
      } else if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
        triggerElementRef.current = document.activeElement;
      }

      // If opening fresh, set default date if not already set
      setFormData((prev) => ({
        ...prev,
        date: prev.date || initializeDefaultDate(),
      }));

      setIsOpen(true);
    },
    [initializeDefaultDate]
  );

  const closeScheduleCall = useCallback(() => {
    setIsOpen(false);
    // Return focus to trigger button
    setTimeout(() => {
      if (triggerElementRef.current && typeof triggerElementRef.current.focus === "function") {
        triggerElementRef.current.focus();
      }
    }, 50);
  }, []);

  const resetBooking = useCallback(() => {
    setCurrentStep(1);
    setFormData({
      ...defaultFormData,
      date: initializeDefaultDate(),
    });
    setErrors({});
    setConfirmedBooking(null);
  }, [initializeDefaultDate]);

  const updateFormField = useCallback((field: keyof BookingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (prev[field as keyof BookingFormErrors]) {
        const next = { ...prev };
        delete next[field as keyof BookingFormErrors];
        return next;
      }
      return prev;
    });
  }, []);

  // Validation for Step 1
  const validateStep1 = useCallback((): boolean => {
    const newErrors: BookingFormErrors = {};
    if (!formData.date) {
      newErrors.date = "Please choose a date for your call.";
    }
    if (!formData.time) {
      newErrors.time = "Please select a convenient time slot.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.date, formData.time]);

  // Validation for Step 2
  const validateStep2 = useCallback((): boolean => {
    const newErrors: BookingFormErrors = {};

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name.";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    }

    // Mobile Number (Indian 10-digit mobile)
    const cleanedMobile = formData.mobileNumber.replace(/[\s-]/g, "");
    const mobileRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
    if (!cleanedMobile) {
      newErrors.mobileNumber = "Please enter your mobile number.";
    } else if (!mobileRegex.test(cleanedMobile)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit Indian mobile number.";
    }

    // Email Address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.fullName, formData.mobileNumber, formData.email]);

  // Submit Booking to Backend
  const submitBooking = async (): Promise<boolean> => {
    if (!validateStep1() || !validateStep2()) {
      return false;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/schedule-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ message: data.error || "Failed to schedule call. Please try again." });
        }
        setIsSubmitting(false);
        return false;
      }

      setConfirmedBooking(data.booking);
      setCurrentStep(4); // Move to success step
      setIsSubmitting(false);
      return true;
    } catch {
      setErrors({ message: "Network error. Please check your connection and try again." });
      setIsSubmitting(false);
      return false;
    }
  };

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  return (
    <ScheduleCallContext.Provider
      value={{
        isOpen,
        openScheduleCall,
        closeScheduleCall,
        currentStep,
        setCurrentStep,
        formData,
        setFormData,
        updateFormField,
        errors,
        setErrors,
        isSubmitting,
        confirmedBooking,
        resetBooking,
        submitBooking,
        validateStep1,
        validateStep2,
      }}
    >
      {children}
    </ScheduleCallContext.Provider>
  );
}

export function useScheduleCall() {
  const context = useContext(ScheduleCallContext);
  if (!context) {
    throw new Error("useScheduleCall must be used within a ScheduleCallProvider");
  }
  return context;
}
