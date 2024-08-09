SET IDENTITY_INSERT SysRole ON

INSERT INTO SysRole(role_id, role_name, status, creator_id, updater_id, create_time, update_time) VALUES
	(1, N'Quản trị viên', 1, 1, 1, '2024-05-17 20:42:33.567', '2024-05-17 20:42:33.567'),
	(2, N'Giảng viên', 1, 1, 1, '2024-05-17 20:42:33.567', '2024-05-17 20:42:33.567'),
	(3, N'Sinh viên', 1, 1, 1, '2024-05-17 20:42:33.567', '2024-05-17 20:42:33.567')

SET IDENTITY_INSERT SysRole OFF
GO

--Them khoa
INSERT INTO Faculty(faculty_id, faculty_name, creator_id, updater_id, create_time, update_time) VALUES
	(10010, N'Công Nghệ Thông Tin', 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(10011, N'Quản Trị Kinh Doanh', 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(10012, N'Điện - Điện tử', 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(10013, N'Kế Toán', 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(10014, N'Luật', 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(10015, N'Thết kế đồ họa', 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567')
GO

--Them mon hoc
-- Khoa CNTT 10010
INSERT INTO Course(course_code, course_name, credit, description, status, creator_id, create_time,faculty_id) VALUES
('1001002',N'Lập trình hướng đối tượng',4,N'Các chủ đề của học phần bao gồm: khái niệm đối tượng và mô hình hóa vấn đề hướng đối tượng, lớp và phương thức.',1,1,getdate(),10010),
('1001001',N'Phương pháp lập trình',4,N'Học phần này giới thiệu cơ bản về máy tính, lập trình, thuật toán, chương trình, và quá trình xây dựng chương trình.',1,1,getdate(),10010),
('1001003',N'Hệ cơ sở dữ liệu',4,N'Môn học giới thiệu các khái niệm và các kỹ thuật cơ bản cần thiết để thiết kế và cài đặt các ứng dụng cơ sở dữ liệu.',1,1,getdate(),10010),
('1001004',N'Phân tích và thiết kế yêu cầu',3,N'Trình bày quá trình chuyển đổi từ phân tích yêu cầu nghiệp vụ sang thiết kế, UML và mô hình hóa use case (Use Case Modelling).',1,1,getdate(),10010),
('1001005',N'Thực tập nghề nghiệp',1,N'Giới thiệu thực tế hình dáng của các linh kiện cơ bản và dụng cụ cần thiết dùng để bấm cáp, kiểm tra cáp mạng, lắp ráp máy tính, phân tích các sơ đồ và sự hoạt động của các máy tính.',1,1,getdate(),10010),
('1001006',N'Lập trình web và ứng dụng',3,N'Các chủ đề của học phần bao gồm: Cách thiết kế trang web sử dụng ngôn ngữ HTML, CSS. Tăng tính tương tác với người dùng sử dụng ngôn ngữ Javascript.Các vấn đề bảo mật trong website.
',1,1,getdate(),10010),
('1001007',N'Cấu trúc rời rạc',4,N'Sinh viên sẽ được học về các khái niệm có ứng dụng rộng rãi trong công nghệ thông tin: Các khái niệm logic, Các phương pháp chứng minh các mệnh đề, Tập hợp và các quan hệ giữa các tập hợp, Đồ thị và cây.
',1,1,getdate(),10010),
('1001008',N'Công nghệ Java',3,N'Ngôn ngữ lập trình Java cơ bản và nâng cao. Làm việc với cơ sở dữ liệu trong Java: JDBC, Hibernate, Spring Data JPA. Các công nghệ và kỹ thuật trong phát triển phần mềm trên nền tảng Java như Servlet & Spring.',1,1,getdate(),10010),
('1001009',N'Mẫu thiết kế',3,N'Học phần này cũng giới thiệu cách các ngôn ngữ lập trình cấp cao (như Java, C#) sử dụng mẫu thiết kế để xây dựng các lớp đối tượng. Nhằm giúp sinh viên hiểu rõ hơn và vận dụng tốt hơn mẫu thiết kế vào công việc của mình.',1,1,getdate(),10010),
('1001010',N'Phát triển ứng dụng web với NodeJS',3,N'Các chủ đề của mô-đun bao gồm: Cách tạo trang web bằng NodeJS, HTML, CSS. Tăng tương tác với người dùng bằng ngôn ngữ Javascript.',1,1,getdate(),10010)
GO

-- Khoa QTKD 10011
INSERT INTO Course(course_code, course_name, credit, description, status, creator_id, create_time,faculty_id) VALUES
('1001101',N'Chuyên đề định hướng nghề nghiệp',2,N'Chapter 1: Marketing careers in the twenty-first century, Chapter 2: Careers in Marketing research, Chapter 3: Careers in Product development, Chapter 4: Careers in Advertising and sales promotion.',1,1,getdate(),10011),
('1001102',N'Kinh tế vĩ mô',3,N'Provide the concepts of macroeconomics including: methods of measuring total output and general price level of the economy; Aggregate supply, aggregate demand and the method of determining.',1,1,getdate(),10011),
('1001103',N'Toán kinh tế',3,N'Ma trận và hệ phương trình tuyến tính, Lãi đơn, lãi kép, Vi tích phân hàm một biến, Vi phân hàm nhiều biến',1,1,getdate(),10011),
('1001104',N'Nguyên lý quản trị',3,N'Chapter 1: Managers in the Workplace, Chapter 2: Management History, Chapter 3: Managing the Environment and the Organization’s Culture, Chapter 4: Managing  Communication.',1,1,getdate(),10011),
('1001105',N'Thống kê kinh doanh và kinh tế',4,N'Môn học cung cấp những kiến thức và khái niệm cơ bản nhất của thống kê trong kinh doanh và kinh tế. Nội dung chủ yếu của môn học bao gồm: Thu thập, kiểm định tham số và phi tham số, mô hình hồi quy hai biến.',1,1,getdate(),10011),
('1001106',N'Thương mại điện tử',3,N'Provide basic knowledge about e-commerce, business models, profit model, business processes; identify the opportunities of e-commerce; the international nature of e-commerce.',1,1,getdate(),10011),
('1001107',N'Quản lý sáng tạo',2,N'The objectives of this course are to enhance the students’ (a) creativity, (b) ability to innovate and (c) ability to identify, recruit, develop, manage, retain, and collaborate with creative people.',1,1,getdate(),10011),
('1001108',N'Tiếp thị B2B',3,N'This course is a study of the core concepts of marketing as applied to Business to Business (B2B) activity.',1,1,getdate(),10011),
('1001109',N'Quản trị bán lẻ',3,N'An overview of retailing from a management perspective. The development of retailing; the Australian retail industry and its environment; merchandising planning, control and distribution; pricing merchandise.',1,1,getdate(),10011),
('1001110',N'Tiếp thị công nghệ số',3,N'This course provides students a new view about marketing in the era of Internet. Beside introducing knowledge about digital marketing.',1,1,getdate(),10011)
GO

-- Khoa dien dien tu 10012
INSERT INTO Course(course_code, course_name, credit, description, status, creator_id, create_time, faculty_id) VALUES
('1001201',N'An toàn điện',2,N'An toàn điện là môn học cung cấp kiến thức về các biện pháp bảo vệ an toàn trong công việc điện.',1,1,getdate(),10012),
('1001202',N'Đo lường điện - điện tử',2,N'Đo lường điện - điện tử giúp sinh viên hiểu về các phương pháp đo lường trong ngành điện - điện tử.',1,1,getdate(),10012),
('1001203',N'Kỹ thuật cảm biến',2,N'Kỹ thuật cảm biến tập trung vào việc nghiên cứu và ứng dụng các công nghệ cảm biến trong thực tế.',1,1,getdate(),10012),
('1001204',N'Kỹ thuật Vi xử lý',2,N'Kỹ thuật Vi xử lý là môn học chuyên sâu về vi xử lý và các ứng dụng trong hệ thống điện tử.',1,1,getdate(),10012),
('1001205',N'Linh kiện điện tử',3,N'Linh kiện điện tử bao gồm việc tìm hiểu về các loại linh kiện và cách sử dụng chúng trong thiết kế mạch điện tử.',1,1,getdate(),10012),
('1001206',N'Nhập môn ngành Điện- Điện tử',1,N'Nhập môn ngành Điện- Điện tử giới thiệu về ngành nghề và cơ hội nghề nghiệp trong lĩnh vực này.',1,1,getdate(),10012),
('1001207',N'TH Kỹ thuật lập trình C',4,N'TH Kỹ thuật lập trình C là môn học hướng dẫn sinh viên về lập trình ngôn ngữ C và các kỹ thuật liên quan.',1,1,getdate(),10012),
('1001208',N'Xử lý tín hiệu số',4,N'Xử lý tín hiệu số tập trung vào việc xử lý và phân tích tín hiệu số trong hệ thống điện tử.',1,1,getdate(),10012),
('1001209',N'Cấu trúc phần cứng máy tính',4,N'Cấu trúc phần cứng máy tính giúp sinh viên hiểu về các thành phần cấu tạo nên máy tính và hoạt động của chúng.',1,1,getdate(),10012),
('1001210',N'Kỹ thuật mạch điện tử',3,N'Kỹ thuật mạch điện tử tập trung vào việc thiết kế và phân tích mạch điện tử trong các hệ thống điện tử.',1,1,getdate(),10012);
GO

-- Khoa kế toán 10013
INSERT INTO Course(course_code, course_name, credit, description, status, creator_id, create_time, faculty_id) VALUES
('1001301',N'Kế toán tài chính 1',3,N'Kế toán tài chính 1 giúp sinh viên hiểu về các nguyên lý cơ bản và phương pháp kế toán tài chính.',1,1,getdate(),10013),
('1001302',N'Kế toán quản trị 1',3,N'Kế toán quản trị 1 tập trung vào việc áp dụng kế toán để hỗ trợ quản lý và ra quyết định trong doanh nghiệp.',1,1,getdate(),10013),
('1001303',N'Kiểm toán 1',3,N'Kiểm toán 1 giúp sinh viên hiểu về quy trình kiểm toán và các phương pháp kiểm tra độ chính xác của thông tin tài chính.',1,1,getdate(),10013),
('1001304',N'Luật kế toán 1',2,N'Luật kế toán 1 cung cấp kiến thức về các quy định pháp lý liên quan đến lĩnh vực kế toán.',1,1,getdate(),10013),
('1001305',N'Kế toán chi phí 1',3,N'Kế toán chi phí 1 tập trung vào việc tính toán và phân tích chi phí sản xuất trong doanh nghiệp.',1,1,getdate(),10013),
('1001306',N'Quản lý tài chính 1',3,N'Quản lý tài chính 1 giúp sinh viên hiểu về quy trình quản lý tài chính và các công cụ quản lý tài chính hiệu quả.',1,1,getdate(),10013),
('1001307',N'Tài chính doanh nghiệp 1',3,N'Tài chính doanh nghiệp 1 tập trung vào việc nghiên cứu về tài chính trong môi trường kinh doanh.',1,1,getdate(),10013),
('1001308',N'Kế toán quốc tế 1',3,N'Kế toán quốc tế 1 giúp sinh viên hiểu về các tiêu chuẩn kế toán quốc tế và ứng dụng chúng trong thực tế.',1,1,getdate(),10013),
('1001309',N'Phân tích tài chính 1',3,N'Phân tích tài chính 1 tập trung vào việc phân tích báo cáo tài chính để đưa ra các quyết định chiến lược cho doanh nghiệp.',1,1,getdate(),10013),
('1001310',N'Kế toán hành chính sự nghiệp 1',3,N'Kế toán hành chính sự nghiệp 1 giúp sinh viên hiểu về công tác kế toán trong các cơ quan hành chính công.',1,1,getdate(),10013);
GO

-- Khoa Luật 10014
INSERT INTO Course(course_code, course_name, credit, description, status, creator_id, create_time, faculty_id) VALUES
('1001401',N'Lý luận pháp luật',3,N'Lý luận pháp luật là môn học cung cấp kiến thức về các nguyên lý cơ bản và hệ thống pháp luật.',1,1,getdate(),10014),
('1001402',N'Luật dân sự 1',3,N'Luật dân sự 1 tập trung vào việc nghiên cứu về quy định pháp lý liên quan đến quan hệ dân sự.',1,1,getdate(),10014),
('1001403',N'Luật hành chính 1',3,N'Luật hành chính 1 giúp sinh viên hiểu về hệ thống pháp luật về quản lý hành chính và công tác cải cách hành chính.',1,1,getdate(),10014),
('1001404',N'Luật tư pháp 1',2,N'Luật tư pháp 1 cung cấp kiến thức về hệ thống pháp luật về tư pháp và các quy trình tư pháp.',1,1,getdate(),10014),
('1001405',N'Luật hình sự 1',3,N'Luật hình sự 1 tập trung vào việc nghiên cứu về quy định pháp lý liên quan đến tội phạm và hình sự học.',1,1,getdate(),10014),
('1001406',N'Luật kinh tế 1',3,N'Luật kinh tế 1 giúp sinh viên hiểu về quy định pháp lý liên quan đến hoạt động kinh tế và thương mại.',1,1,getdate(),10014),
('1001407',N'Luật lao động 1',3,N'Luật lao động 1 tập trung vào việc nghiên cứu về quy định pháp lý liên quan đến lao động và lao động học.',1,1,getdate(),10014),
('1001408',N'Luật quốc tế 1',3,N'Luật quốc tế 1 giúp sinh viên hiểu về hệ thống pháp luật quốc tế và quan hệ pháp lý giữa các quốc gia.',1,1,getdate(),10014),
('1001409',N'Luật sự nghiệp 1',3,N'Luật sự nghiệp 1 giúp sinh viên hiểu về quy trình và công việc của một luật sư trong thực tế.',1,1,getdate(),10014),
('1001410',N'Luật thông tin 1',3,N'Luật thông tin 1 tập trung vào việc nghiên cứu về quy định pháp lý liên quan đến thông tin và truyền thông.',1,1,getdate(),10014);
GO

-- Khoa Thiết kế đồ họa 10015
INSERT INTO Course(course_code, course_name, credit, description, status, creator_id, create_time, faculty_id) VALUES
('1001501', N'Đồ họa Vector', 3, N'Môn học Đồ họa Vector giúp sinh viên nắm vững về các kỹ thuật thiết kế vector.', 1, 1, GETDATE(), 10015),
('1001502', N'Thiết kế giao diện', 2, N'Môn học Thiết kế giao diện hướng dẫn sinh viên về cách thiết kế giao diện người dùng hiệu quả.', 1, 1, GETDATE(), 10015),
('1001503', N'Đồ họa 3D', 4, N'Đồ họa 3D là môn học giúp sinh viên hiểu rõ về thiết kế và tạo hình 3 chiều.', 1, 1, GETDATE(), 10015),
('1001504', N'Đồ họa đa phương tiện', 3, N'Môn học Đồ họa đa phương tiện giúp sinh viên phát triển kỹ năng thiết kế đồ họa đa phương tiện.', 1, 1, GETDATE(), 10015),
('1001505', N'Thiết kế logo', 1, N'Môn học Thiết kế logo tập trung vào việc hướng dẫn sinh viên về cách thiết kế logo sáng tạo và độc đáo.', 1, 1, GETDATE(), 10015),
('1001506', N'Thiết kế đồ họa động', 3, N'Môn học Thiết kế đồ họa động giúp sinh viên nắm vững các kỹ năng thiết kế đồ họa động.', 1, 1, GETDATE(), 10015),
('1001507', N'Thiết kế đồ họa cho web', 4, N'Môn học Thiết kế đồ họa cho web hướng dẫn sinh viên về cách thiết kế đồ họa cho trang web.', 1, 1, GETDATE(), 10015),
('1001508', N'Đồ họa số', 2, N'Môn học Đồ họa số giúp sinh viên hiểu rõ về các khái niệm và công nghệ trong đồ họa số.', 1, 1, GETDATE(), 10015),
('1001509', N'Thiết kế đồ họa đa phương tiện', 3, N'Môn học Thiết kế đồ họa đa phương tiện tập trung vào việc phát triển kỹ năng thiết kế đồ họa đa phương tiện.', 1, 1, GETDATE(), 10015),
('1001510', N'Đồ họa và truyền thông', 3, N'Đồ họa và truyền thông là môn học giúp sinh viên hiểu về tầm quan trọng của đồ họa trong truyền thông.', 1, 1, GETDATE(), 10015);
GO

---- Update du lieu Shift
insert into Shift(shift_code,start_time,end_time,break_hour,status,creator_id,create_time) VALUES
('ca1','6h50','9h20','15',1,1,getDate()),
('ca2','9h30','12h00','15',1,1,getDate()),
('ca3','12h45','15h15','15',1,1,getDate()),
('ca4','15h25','17h55','15',1,1,getDate()),
('ca5','18h05','20h35','15',1,1,getDate())
GO

-- Dữ liệu phòng học
INSERT INTO Classroom(classroom_code, capacity, floor, description, status, creator_id, updater_id, create_time, update_time) VALUES
	('C201', 50, 2, N'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567'),
	('C202', 50, 2, N'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567'),
	('C203', 50, 2, N'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567'),
	('C204', 50, 2, N'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567'),
	('C205', 50, 2, N'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567')
GO

-- ID auto increase
-- Password admin: 123456
-- password 3 số cuối sdt + Ten(inhoa chữ đầu) + khóa (Guang vien)
-- password 3 so cuối sdt + Ten(inhoa chữ đầu) + 4 số cuối MSSV (Sinh viên)

INSERT INTO SysUser(email, username, password, nickname, phone, avatar_path, face_image_path, role_id, status, creator_id, updater_id, create_time, update_time) VALUES
	('admin@gmail.com', 'admin', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Quản trị viên', '0123456789', '', '', 1, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567')

-- Dữ liệu người dùng ban đầu tạo để test.
SET IDENTITY_INSERT SysUser ON
INSERT INTO SysUser(user_id, email, username, password, nickname, phone, avatar_path, face_image_path, role_id, status, creator_id, updater_id, create_time, update_time) VALUES
	(899, 'tranvana@gmail.com', 'admin', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Trần Văn A', '0123456789', '', '', 2, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(900, '52000900@gmail.com', '52000900', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Nguyễn Ðức Quyền', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(901, '52000901@gmail.com', '52000901', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Mã Công Hoán', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(902, '52000902@gmail.com', '52000902', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Hoàng Chiêu Phong', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(903, '52000903@gmail.com', '52000903', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Thái Hồng Thư', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(904, '52000904@gmail.com', '52000904', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Vũ Lệ Khánh', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(905, '52000905@gmail.com', '52000905', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Đỗ Ái Hồng', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567')
SET IDENTITY_INSERT SysUser OFF
GO

-- Dữ liệu thời gian ca học
SET IDENTITY_INSERT ClassRoomShift ON
INSERT INTO ClassRoomShift(classroomshift_id, classroom_code, shift_code, status, creator_id, updater_id, create_time, update_time) VALUES
	(201, 'C201', 'ca1', 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(202, 'C202', 'ca1', 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(203, 'C203', 'ca1', 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(204, 'C204', 'ca1', 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230')
SET IDENTITY_INSERT ClassRoomShift OFF
GO

-- Dữ liệu nhóm môn học
SET IDENTITY_INSERT CourseGroup ON
INSERT INTO CourseGroup(course_group_id, course_code, group_code, teacher_id, classroomshift_id, total_student_qty, status, creator_id, updater_id, create_time, update_time) VALUES
	(100, '1001002', 'N1', 899, 201, 6, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230')
SET IDENTITY_INSERT CourseGroup OFF
GO

-- Dữ liệu danh sách sinh viên nhóm môn học
INSERT INTO CourseGroupStudentList(course_group_id, student_id, total_absent, ban_yn, status, creator_id, updater_id, create_time, update_time) VALUES
	(100, 900, 0, 0, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(100, 901, 0, 0, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(100, 902, 0, 0, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(100, 903, 0, 0, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(100, 904, 0, 0, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(100, 905, 0, 0, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230')
GO

-- Dữ liệu điểm danh để test
INSERT INTO AttendanceRawData(student_id, course_group_id, attend_date, attend_type, attend_time, attend_image_path, creator_id, create_time) VALUES
	(900, 100, '20240728', 0, '06:30', '', 899, '2024-07-28 18:11:02.230'),
	(901, 100, '20240728', 0, '06:30', '', 899, '2024-07-28 18:11:02.230'),
	(902, 100, '20240728', 0, '06:30', '', 899, '2024-07-28 18:11:02.230'),
	(903, 100, '20240728', 0, '06:30', '', 899, '2024-07-28 18:11:02.230'),
	(904, 100, '20240728', 0, '06:30', '', 899, '2024-07-28 18:11:02.230'),
	(905, 100, '20240728', 0, '06:30', '', 899, '2024-07-28 18:11:02.230')
GO

-- Dữ liệu update thêm học kỳ
insert into TernYear(tern_year_name,tern,year,status,creator_id,create_time) 
values(N'Học kỳ 1 năm học 2023',1,2023,1,1,getDate()),
(N'Học kỳ 2 năm học 2023',2,2023,1,1,getDate()),
(N'Học kỳ 3 năm học 2023',3,2023,1,1,getDate()),
(N'Học kỳ 1 năm học 2024',1,2024,1,1,getDate()),
(N'Học kỳ 2 năm học 2024',2,2024,1,1,getDate()),
(N'Học kỳ 3 năm học 2024',3,2024,1,1,getDate())

update CourseGroup set semester_year_id = 1
update CourseGroup set semester_year_id = 2 where course_group_id = 40
-- Update Semester 8-8
update SemesterYear set week_from =1,week_to= 22 where semester = 1
update SemesterYear set week_from =28,week_to= 40 where semester = 2
update SemesterYear set week_from =43,week_to= 52 where semester = 3