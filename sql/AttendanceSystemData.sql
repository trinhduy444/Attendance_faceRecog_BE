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


--New 07/07
INSERT INTO SysUser(email, username, password, nickname, phone, avatar_path, face_image_path, role_id, status, creator_id, updater_id, create_time, update_time) VALUES('dohothuanthuy2002@gmail.com', '72001424', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Đỗ Hồ Thuận Thủy', '0901944765', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567')
INSERT INTO SysUser(email, username, password, nickname, phone, avatar_path, face_image_path, role_id, status, creator_id, updater_id, create_time, update_time) VALUES('trinhduy444@gmail.com', '52001424', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Trinh Truong Duy', '01238462331', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567')


INSERT INTO SysUser(email, username, password, nickname, phone, avatar_path, face_image_path, role_id, status, creator_id, updater_id, create_time, update_time) VALUES('trinhduy444@gmail.com', '52001424', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Trinh Truong Duy', '01238462331', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567')

-- New 20/07 (update2)
INSERT INTO Faculty(faculty_id, faculty_name, creator_id, updater_id, create_time, update_time) VALUES(10010, N'Công Nghệ Thông Tin', 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567')
INSERT INTO Faculty(faculty_id, faculty_name, creator_id, updater_id, create_time, update_time) VALUES(10011, N'Quản Trị Kinh Doanh', 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567')
INSERT INTO Faculty(faculty_id, faculty_name, creator_id, updater_id, create_time, update_time) VALUES(10012, N'Điện - Điện tử', 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567')
