-- Database: Projector

CREATE TABLE IF NOT EXISTS `users` (
  `uuid` varchar(36) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `pwd` varchar(60) NOT NULL,
  `CREATED` timestamp NOT NULL DEFAULT current_timestamp(),
  `UPDATED` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cgu` tinyint(1) NOT NULL,
  `lastLogin` timestamp NULL DEFAULT NULL,
  `statut` enum('normal','moderateur','administrateur') NOT NULL DEFAULT 'normal',
  `bio` varchar(500) DEFAULT NULL,
  `profilePicture` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `project_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `project_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `task_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `project` (
  `uuid` varchar(36) NOT NULL,
  `project_name` varchar(50) NOT NULL,
  `user_uuid` varchar(36) NOT NULL,
  `project_description` varchar(500) NOT NULL,
  `project_created` timestamp NOT NULL DEFAULT current_timestamp(),
  `project_updated` timestamp NULL DEFAULT current_timestamp(),
  `project_deadline` date DEFAULT NULL,
  `project_category_id` int(11) NOT NULL,
  `project_status_id` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`uuid`),
  KEY `user_uuid` (`user_uuid`),
  KEY `fk_project_category_id` (`project_category_id`),
  KEY `fk_project_status_id` (`project_status_id`),
  CONSTRAINT `fk_project_category_id` FOREIGN KEY (`project_category_id`) REFERENCES `project_categories` (`id`),
  CONSTRAINT `fk_project_status_id` FOREIGN KEY (`project_status_id`) REFERENCES `project_status` (`id`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`user_uuid`) REFERENCES `users` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `project_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_uuid` varchar(36) NOT NULL,
  `project_uuid` varchar(36) NOT NULL,
  `role` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_uuid` (`user_uuid`),
  KEY `project_uuid` (`project_uuid`),
  CONSTRAINT `project_members_ibfk_1` FOREIGN KEY (`user_uuid`) REFERENCES `users` (`uuid`),
  CONSTRAINT `project_members_ibfk_2` FOREIGN KEY (`project_uuid`) REFERENCES `project` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `project_users_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_user_uuid` varchar(36) DEFAULT NULL,
  `task_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_put_user_uuid` (`task_user_uuid`),
  KEY `fk_put_task_id` (`task_id`),
  CONSTRAINT `fk_put_task_id` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`),
  CONSTRAINT `fk_put_user_uuid` FOREIGN KEY (`task_user_uuid`) REFERENCES `users` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_name` varchar(50) NOT NULL,
  `task_description` varchar(500) NOT NULL,
  `project_uuid` varchar(36) NOT NULL,
  `task_status_id` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `fk_tasks_project_uuid` (`project_uuid`),
  KEY `fk_task_status_id` (`task_status_id`),
  CONSTRAINT `fk_task_status_id` FOREIGN KEY (`task_status_id`) REFERENCES `task_status` (`id`),
  CONSTRAINT `fk_tasks_project_uuid` FOREIGN KEY (`project_uuid`) REFERENCES `project` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `project_message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_uuid` varchar(36) DEFAULT NULL,
  `user_uuid` varchar(36) DEFAULT NULL,
  `message_created` timestamp NULL DEFAULT current_timestamp(),
  `message_content` varchar(255) DEFAULT NULL,
  `modified` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_pm_project_uuid` (`project_uuid`),
  KEY `fk_pm_user_uuid` (`user_uuid`),
  CONSTRAINT `fk_pm_project_uuid` FOREIGN KEY (`project_uuid`) REFERENCES `project` (`uuid`),
  CONSTRAINT `fk_pm_user_uuid` FOREIGN KEY (`user_uuid`) REFERENCES `users` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
