SET IDENTITY_INSERT SysRole ON

INSERT INTO SysRole(role_id, role_name, status, creator_id, updater_id, create_time, update_time) VALUES
	(1, N'Quản trị viên', 1, 1, 1, '2024-05-17 20:42:33.567', '2024-05-17 20:42:33.567'),
	(2, N'Giảng viên', 1, 1, 1, '2024-05-17 20:42:33.567', '2024-05-17 20:42:33.567'),
	(3, N'Sinh viên', 1, 1, 1, '2024-05-17 20:42:33.567', '2024-05-17 20:42:33.567')

SET IDENTITY_INSERT SysRole OFF

-- ID auto increase
-- Password 123456
INSERT INTO SysUser(email, username, password, nickname, phone, avatar_path, face_image_path, role_id, status, creator_id, updater_id, create_time, update_time) VALUES
	('admin@gmail.com', 'admin', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Quản trị viên', '0123456789', '', '', 1, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	('laptd@gmail.com', 'laptd', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Tôn Đình Lập', '0123456789', '', '', 2, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	('hieunt@gmail.com', 'hieunt', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Ngô Tâm Hiệu', '0123456789', '', '', 2, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	('52000705@gmail.com', '52000705', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Trần Lai Phước', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	('52000655@gmail.com', '52000655', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Trịnh Trường Duy', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	('52000719@gmail.com', '52000719', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Huỳnh Trí Thông', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567')
	