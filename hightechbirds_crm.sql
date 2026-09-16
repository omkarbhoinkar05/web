-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: hightechbirds_crm
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `hightechbirds_crm`
--

/*!40000 DROP DATABASE IF EXISTS `hightechbirds_crm`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `hightechbirds_crm` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `hightechbirds_crm`;

--
-- Table structure for table `htb_activities`
--

DROP TABLE IF EXISTS `htb_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `htb_activities` (
  `id` varchar(64) NOT NULL,
  `lead_id` varchar(64) DEFAULT NULL,
  `lead_name` varchar(191) DEFAULT NULL,
  `type` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `actor` varchar(100) NOT NULL,
  `previous_status` varchar(50) DEFAULT NULL,
  `new_status` varchar(50) DEFAULT NULL,
  `date` varchar(32) NOT NULL,
  `time` varchar(32) NOT NULL,
  `created_at` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_activities_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `htb_activities`
--

LOCK TABLES `htb_activities` WRITE;
/*!40000 ALTER TABLE `htb_activities` DISABLE KEYS */;
INSERT INTO `htb_activities` VALUES ('act-1789580344929','HTB-001','Frontend Contact Lead Test','Lead Created','New lead created for Web Design via Website Contact Form.','Unassigned',NULL,NULL,'2026-09-16','Just now','2026-09-16T17:39:04.915Z'),('act-1789580345271','HTB-002','Frontend Schedule Client Test','Lead Created','New lead created for Video Call (Google Meet) via Schedule Call.','Unassigned',NULL,NULL,'2026-09-16','Just now','2026-09-16T17:39:05.261Z'),('act-1789580346553','HTB-003','Direct Admin CRM Lead Test','Lead Created','New lead created for SaaS App Development via Referral.','Omkar Bhoir (Admin)',NULL,NULL,'2026-09-16','Just now','2026-09-16T17:39:06.541Z'),('act-1789580346857',NULL,NULL,'Team Action','Security: Password updated in MySQL for administrator account (admin@hightechbirds.com).','admin@hightechbirds.com',NULL,NULL,'2026-09-16','Just now','2026-09-16T17:39:06.843Z'),('act-1789580346930',NULL,NULL,'Team Action','Security: Password updated in MySQL for administrator account (admin@hightechbirds.com).','admin@hightechbirds.com',NULL,NULL,'2026-09-16','Just now','2026-09-16T17:39:06.921Z');
/*!40000 ALTER TABLE `htb_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `htb_career_applications`
--

DROP TABLE IF EXISTS `htb_career_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `htb_career_applications` (
  `id` varchar(64) NOT NULL,
  `application_id` varchar(32) NOT NULL,
  `applicant_name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `mobile` varchar(32) NOT NULL,
  `resume_file_name` varchar(255) NOT NULL,
  `resume_file_path` varchar(255) NOT NULL,
  `resume_size_bytes` int(11) NOT NULL,
  `resume_mime_type` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(50) NOT NULL,
  `assigned_to` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `applied_date` varchar(50) NOT NULL,
  `created_at` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `application_id` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `htb_career_applications`
--

LOCK TABLES `htb_career_applications` WRITE;
/*!40000 ALTER TABLE `htb_career_applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `htb_career_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `htb_contact_enquiries`
--

DROP TABLE IF EXISTS `htb_contact_enquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `htb_contact_enquiries` (
  `id` varchar(64) NOT NULL,
  `enquiry_id` varchar(32) NOT NULL,
  `full_name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `mobile` varchar(32) NOT NULL,
  `service` varchar(100) NOT NULL,
  `budget` varchar(100) DEFAULT NULL,
  `message` text NOT NULL,
  `source` varchar(100) NOT NULL,
  `status` varchar(50) NOT NULL,
  `assigned_to` varchar(100) NOT NULL,
  `lead_id` varchar(64) DEFAULT NULL,
  `created_at` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `enquiry_id` (`enquiry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `htb_contact_enquiries`
--

LOCK TABLES `htb_contact_enquiries` WRITE;
/*!40000 ALTER TABLE `htb_contact_enquiries` DISABLE KEYS */;
/*!40000 ALTER TABLE `htb_contact_enquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `htb_follow_ups`
--

DROP TABLE IF EXISTS `htb_follow_ups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `htb_follow_ups` (
  `id` varchar(64) NOT NULL,
  `follow_up_id` varchar(32) NOT NULL,
  `lead_id` varchar(64) NOT NULL,
  `lead_name` varchar(191) NOT NULL,
  `lead_mobile` varchar(32) NOT NULL,
  `date` varchar(32) NOT NULL,
  `time` varchar(32) NOT NULL,
  `type` varchar(50) NOT NULL,
  `assigned_to` varchar(100) NOT NULL,
  `status` varchar(50) NOT NULL,
  `notes` text NOT NULL,
  `completed_at` varchar(50) DEFAULT NULL,
  `created_at` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `follow_up_id` (`follow_up_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `htb_follow_ups`
--

LOCK TABLES `htb_follow_ups` WRITE;
/*!40000 ALTER TABLE `htb_follow_ups` DISABLE KEYS */;
/*!40000 ALTER TABLE `htb_follow_ups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `htb_leads`
--

DROP TABLE IF EXISTS `htb_leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `htb_leads` (
  `id` varchar(64) NOT NULL,
  `lead_id` varchar(32) NOT NULL,
  `full_name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `mobile` varchar(32) NOT NULL,
  `service` varchar(100) NOT NULL,
  `budget` varchar(100) DEFAULT NULL,
  `source` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `priority` varchar(50) NOT NULL,
  `assigned_to` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `last_contact` varchar(100) DEFAULT NULL,
  `next_follow_up` varchar(100) DEFAULT NULL,
  `closing_note` text DEFAULT NULL,
  `lost_reason` varchar(100) DEFAULT NULL,
  `created_at` varchar(64) NOT NULL,
  `updated_at` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lead_id` (`lead_id`),
  KEY `idx_leads_status` (`status`),
  KEY `idx_leads_priority` (`priority`),
  KEY `idx_leads_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `htb_leads`
--

LOCK TABLES `htb_leads` WRITE;
/*!40000 ALTER TABLE `htb_leads` DISABLE KEYS */;
/*!40000 ALTER TABLE `htb_leads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `htb_notes`
--

DROP TABLE IF EXISTS `htb_notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `htb_notes` (
  `id` varchar(64) NOT NULL,
  `lead_id` varchar(64) NOT NULL,
  `note` text NOT NULL,
  `actor` varchar(100) NOT NULL,
  `created_at` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_notes_lead` (`lead_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `htb_notes`
--

LOCK TABLES `htb_notes` WRITE;
/*!40000 ALTER TABLE `htb_notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `htb_notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `htb_notifications`
--

DROP TABLE IF EXISTS `htb_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `htb_notifications` (
  `id` varchar(64) NOT NULL,
  `title` varchar(191) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `link` varchar(255) NOT NULL,
  `created_at` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `htb_notifications`
--

LOCK TABLES `htb_notifications` WRITE;
/*!40000 ALTER TABLE `htb_notifications` DISABLE KEYS */;
INSERT INTO `htb_notifications` VALUES ('notif-1789580344941','New Contact Enquiry','Frontend Contact Lead Test submitted an enquiry for Web Design.','enquiry',0,'/admin/contact-enquiries','2026-09-16T17:39:04.935Z'),('notif-1789580345282','New Call Booked','Consultation booked by Frontend Schedule Client Test for 2026-09-28 at 03:30 PM.','call',0,'/admin/scheduled-calls','2026-09-16T17:39:05.275Z'),('notif-1789580345568','New Career Application','Frontend Candidate Test submitted their resume application.','career',0,'/admin/career-applications','2026-09-16T17:39:05.556Z');
/*!40000 ALTER TABLE `htb_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `htb_password_resets`
--

DROP TABLE IF EXISTS `htb_password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `htb_password_resets` (
  `id` varchar(64) NOT NULL,
  `email` varchar(191) NOT NULL,
  `otp` varchar(10) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expires_at` varchar(64) NOT NULL,
  `created_at` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_resets_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `htb_password_resets`
--

LOCK TABLES `htb_password_resets` WRITE;
/*!40000 ALTER TABLE `htb_password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `htb_password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `htb_scheduled_calls`
--

DROP TABLE IF EXISTS `htb_scheduled_calls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `htb_scheduled_calls` (
  `id` varchar(64) NOT NULL,
  `call_id` varchar(32) NOT NULL,
  `full_name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `mobile` varchar(32) NOT NULL,
  `service` varchar(100) NOT NULL,
  `date` varchar(32) NOT NULL,
  `time` varchar(32) NOT NULL,
  `timezone` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `notes` text DEFAULT NULL,
  `assigned_to` varchar(100) NOT NULL,
  `lead_id` varchar(64) DEFAULT NULL,
  `created_at` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `call_id` (`call_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `htb_scheduled_calls`
--

LOCK TABLES `htb_scheduled_calls` WRITE;
/*!40000 ALTER TABLE `htb_scheduled_calls` DISABLE KEYS */;
/*!40000 ALTER TABLE `htb_scheduled_calls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `htb_settings`
--

DROP TABLE IF EXISTS `htb_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `htb_settings` (
  `key_name` varchar(64) NOT NULL,
  `value_json` longtext NOT NULL,
  `updated_at` varchar(64) NOT NULL,
  PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `htb_settings`
--

LOCK TABLES `htb_settings` WRITE;
/*!40000 ALTER TABLE `htb_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `htb_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `htb_team`
--

DROP TABLE IF EXISTS `htb_team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `htb_team` (
  `id` varchar(64) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `role` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL DEFAULT 'Admin@123',
  `avatar` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Active',
  `phone` varchar(32) NOT NULL,
  `last_login` varchar(50) DEFAULT NULL,
  `created_at` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `htb_team`
--

LOCK TABLES `htb_team` WRITE;
/*!40000 ALTER TABLE `htb_team` DISABLE KEYS */;
INSERT INTO `htb_team` VALUES ('team-2','Siddharth Shinde','siddharth@hightechbirds.com','Admin','Admin@123',NULL,'Active','+91 9820012345',NULL,'2026-09-16 23:09:51'),('team-3','Anjali Dave','anjali@hightechbirds.com','Sales','Admin@123',NULL,'Active','+91 9833112233',NULL,'2026-09-16 23:09:51'),('team-4','Pooja Hegde','pooja@hightechbirds.com','HR','Admin@123',NULL,'Active','+91 9711556677',NULL,'2026-09-16 23:09:51'),('team-super','Omkar Bhoir','admin@hightechbirds.com','Super Admin','Admin@123',NULL,'Active','+91 99208 18481',NULL,'2026-09-16T17:39:06.843Z');
/*!40000 ALTER TABLE `htb_team` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-16 23:10:13
