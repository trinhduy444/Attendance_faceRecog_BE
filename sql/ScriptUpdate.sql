-- 28/07/2024
-- Update add 
ALTER TABLE Attendance DROP COLUMN attendance_id
ALTER TABLE Attendance ADD [attend_yn] BIT NOT NULL
GO

-- Dữ liệu phòng học
INSERT INTO Classroom
	(classroom_code, capacity, floor, description, status, creator_id, updater_id, create_time, update_time)
VALUES
	('C201', 50, 2, 'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567'),
	('C202', 50, 2, 'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567'),
	('C203', 50, 2, 'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567'),
	('C204', 50, 2, 'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567'),
	('C205', 50, 2, 'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567')
GO

-- Thêm người dùng để test
SET IDENTITY_INSERT SysUser ON
INSERT INTO SysUser
	(user_id, email, username, password, nickname, phone, avatar_path, face_image_path, role_id, status, creator_id, updater_id, create_time, update_time)
VALUES
	(899, 'tranvana@gmail.com', 'GV10010899', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Trần Văn A', '0123456789', '', '', 2, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(900, '52000900@gmail.com', '52000900', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Nguyễn Ðức Quyền', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(901, '52000901@gmail.com', '52000901', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Mã Công Hoán', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(902, '52000902@gmail.com', '52000902', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Hoàng Chiêu Phong', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(903, '52000903@gmail.com', '52000903', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Thái Hồng Thư', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(904, '52000904@gmail.com', '52000904', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Vũ Lệ Khánh', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567'),
	(905, '52000905@gmail.com', '52000905', '$2b$10$80tyEQ0RHJEVM6mBCNRJFOnFtn1Bm3TqHoBsYXTvnFLSV9FEGDNW2', N'Đỗ Ái Hồng', '0123456789', '', '', 3, 1, 1, 1, '2024-05-26 12:42:33.567', '2024-05-26 12:42:33.567')
SET IDENTITY_INSERT SysUser OFF

-- Dữ liệu thời gian ca học
SET IDENTITY_INSERT ClassRoomShift ON
INSERT INTO ClassRoomShift
	(classroomshift_id, classroom_code, shift_code, status, creator_id, updater_id, create_time, update_time)
VALUES
	(201, 'C201', 'ca1', 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(202, 'C202', 'ca1', 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(203, 'C203', 'ca1', 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(204, 'C204', 'ca1', 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230')
SET IDENTITY_INSERT ClassRoomShift OFF
GO

-- Dữ liệu nhóm môn học
SET IDENTITY_INSERT CourseGroup ON
INSERT INTO CourseGroup
	(course_group_id, course_code, group_code, teacher_id, classroomshift_id, total_student_qty, status, creator_id, updater_id, create_time, update_time)
VALUES
	(100, '1001002', 'N1', 899, 201, 6, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230')
SET IDENTITY_INSERT CourseGroup OFF
GO

-- Dữ liệu danh sách sinh viên nhóm môn học
INSERT INTO CourseGroupStudentList
	(course_group_id, student_id, total_absent, ban_yn, status, creator_id, updater_id, create_time, update_time)
VALUES
	(100, 900, 0, 0, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(100, 901, 0, 0, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(100, 902, 0, 0, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(100, 903, 0, 0, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(100, 904, 0, 0, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230'),
	(100, 905, 0, 0, 1, 1, 1, '2024-07-28 18:11:02.230', '2024-07-28 18:11:02.230')
GO

-- Dữ liệu điểm danh để test
INSERT INTO AttendanceRawData
	(student_id, course_group_id, attend_date, attend_type, attend_time, attend_image_path, creator_id, create_time)
VALUES
	(900, 100, '20240728', 0, '06:30', '', 899, '2024-07-28 18:11:02.230'),
	(901, 100, '20240728', 0, '06:30', '', 899, '2024-07-28 18:11:02.230'),
	(902, 100, '20240728', 0, '06:30', '', 899, '2024-07-28 18:11:02.230'),
	(903, 100, '20240728', 0, '06:30', '', 899, '2024-07-28 18:11:02.230'),
	(904, 100, '20240728', 0, '06:30', '', 899, '2024-07-28 18:11:02.230'),
	(905, 100, '20240728', 0, '06:30', '', 899, '2024-07-28 18:11:02.230')
GO

-- Store kéo dữ liệu từ dữ liệu thô sang bảng điểm danh chính
CREATE PROCEDURE UpdateAttendanceFromRawData
	@course_group_id INT,
	@attend_date DATE,
	@user_id INT
AS
BEGIN
	SET NOCOUNT ON

	DECLARE @CurrDate DATETIME = GETDATE()

	-- Student in group list
	SELECT student_id
	INTO #student
	FROM CourseGroupStudentList
	WHERE course_group_id = @course_group_id

	-- Get attendant data
	SELECT *
	INTO #tmp
	FROM AttendanceRawData
	WHERE course_group_id = @course_group_id AND attend_date = @attend_date

	-- Struct
	SELECT TOP 0
		a.*
	INTO #data
	FROM Attendance a
	WHERE 1=0

	-- Insert student with it attendant state
	INSERT INTO #data
		(student_id, course_group_id, attend_date, attend_yn, enter_time)
			SELECT a.student_id, a.course_group_id, a.attend_date, 1, a.attend_time
		FROM #tmp a
		WHERE a.attend_type IN (0, 1)
	UNION ALL
		SELECT a.student_id, @course_group_id, @attend_date, 0, '00:00'
		FROM #student a
		WHERE NOT EXISTS(SELECT 1
		FROM #tmp x
		WHERE a.student_id = x.student_id)

	UPDATE #data SET leave_time = '00:00', note = '', status = 1, creator_id = @user_id, updater_id = @user_id, create_time = @CurrDate, update_time = @CurrDate

	BEGIN TRY
		BEGIN TRANSACTION;
			
			DELETE Attendance FROM Attendance a WHERE EXISTS(SELECT 1
	FROM #data x
	WHERE a.course_group_id = x.course_group_id AND a.attend_date = x.attend_date)
			INSERT INTO Attendance
	SELECT *
	FROM #data

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SELECT ERROR_MESSAGE() AS [message], ERROR_PROCEDURE() AS [error_store], 'PullAttendanceRawData' AS [store]
		ROLLBACK TRANSACTION
	END CATCH;

	DROP TABLE #student, #tmp, #data
END
GO
-- Lệnh để chạy test
--EXEC UpdateAttendanceFromRawData 100, '2024-07-29', 1
--'2024-07-28'
SELECT *
FROM Attendance
GO

-- View tạo để lấy dữ liệu (Nếu chỉ join thì không cần viết store á Duy)
CREATE VIEW vattendance
AS
	SELECT a.*, ISNULL(b.username, '') AS username, ISNULL(b.nickname, '') AS nickname
	FROM Attendance a
		LEFT JOIN SysUser b ON a.student_id = b.user_id
GO
SELECT *
FROM vattendance
GO

-- Store báo cáo tổng hợp dữ liệu điểm danh
CREATE PROCEDURE AttendanceSummaryReport
	@attend_date1 DATE = NULL,
	-- Filter date from
	@attend_date2 DATE = NULL,
	-- Filter date to
	@student_id INT = 0,
	-- Filter by student
	@course_group_id INT = 0
-- Filter by course group
AS
BEGIN
	SET NOCOUNT ON

	-- Data
	SELECT a.*
	INTO #tmp
	FROM Attendance a
	WHERE @student_id IN (a.student_id, 0) AND @course_group_id IN (a.course_group_id, 0)
		AND (@attend_date1 IS NULL OR a.attend_date >= @attend_date1) AND (@attend_date2 IS NULL OR a.attend_date <= @attend_date2)

	-- Course current total day, attend absent
	SELECT a.course_group_id, COUNT(DISTINCT a.attend_date) AS total_day
	INTO #totalDay
	FROM #tmp a
	GROUP BY a.course_group_id
	SELECT a.course_group_id, a.student_id, SUM(IIF(a.attend_yn = 1, 1, 0)) AS total_attend, SUM(IIF(a.attend_yn = 0, 1, 0)) AS total_absent
	INTO #totalAttend
	FROM #tmp a
	GROUP BY a.course_group_id, a.student_id

	-- Report
	SELECT 5 AS xorder, a.course_group_id, ISNULL(c.course_code, '') AS course_code, ISNULL(d.classroom_code, '') AS classroom_code, ISNULL(d.shift_code, '') AS shift_code
			, a.student_id, ISNULL(u.username, '') AS username, ISNULL(u.nickname, '') AS nickname
			, ISNULL(b.total_day, 0) AS total_day, a.total_attend, a.total_absent
	INTO #report
	FROM #totalAttend a
		LEFT JOIN #totalDay b ON a.course_group_id = b.course_group_id
		LEFT JOIN CourseGroup c ON a.course_group_id = c.course_group_id
		LEFT JOIN ClassRoomShift d ON c.classroomshift_id = d.classroomshift_id
		LEFT JOIN SysUser u ON a.student_id = u.user_id

	-- Group row
	INSERT INTO #report
		(xorder, course_group_id, course_code, classroom_code, shift_code, student_id, username, nickname, total_day, total_attend, total_absent)
	SELECT 4, a.course_group_id, MAX(a.course_code), MAX(a.classroom_code), MAX(a.shift_code), 0, '', '', 0, 0, 0
	FROM #report a
	GROUP BY a.course_group_id

	SELECT *
	FROM #report
	ORDER BY course_group_id, xorder
	DROP TABLE #tmp, #totalAttend, #report
END
GO

EXEC AttendanceSummaryReport
GO

-- Store báo cáo chi tiết dữ liệu điểm danh theo nhóm môn
CREATE PROCEDURE AttendanceDetailReport
	@course_group_id INT,
	-- Filter by course group, not allow blank
	@student_id INT = 0
-- Filter by student
AS
BEGIN
	SET NOCOUNT ON

	DECLARE @q NVARCHAR(MAX), @xCols NVARCHAR(4000), @xValues NVARCHAR(4000)
	SELECT @q = '', @xCols = '', @xValues = ''

	-- Data
	SELECT a.*
	INTO #tmp
	FROM Attendance a
	WHERE a.course_group_id = @course_group_id AND @student_id IN (a.student_id, 0)

	-- Total day
	SELECT ROW_NUMBER() OVER(ORDER BY a.attend_date) AS stt, a.attend_date, CAST('' AS VARCHAR(32)) AS xCol, CAST('' AS NVARCHAR(256)) AS xheader
	INTO #days
	FROM #tmp a
	GROUP BY a.attend_date
	ORDER BY a.attend_date
	UPDATE #days SET xCol = 'col' + RTRIM(stt), xheader = N'Buổi ' + RTRIM(stt)
	SELECT @xCols += ', ' + a.xCol, @xValues += ', 0'
	FROM #days a
	ORDER BY a.stt

	-- Report struct
	SELECT @q = 'select top 0 a.course_group_id, a.student_id' + REPLACE(@xCols, ', ', ', cast(0 as tinyint) as ') + ' into #data from attendance a where 1=0
	insert into #data (course_group_id, student_id' + @xCols + ') select a.course_group_id, a.student_id' + @xValues + ' from #tmp a group by a.course_group_id, a.student_id'

	-- Update values
	SELECT @q += '
	update #data set ' + b.xCol + ' = b.attend_yn from #data a join #tmp b on a.course_group_id = b.course_group_id and a.student_id = b.student_id
		and b.attend_date = ''' + CONVERT(VARCHAR(8), a.attend_date, 112) + '''
	'
	FROM #tmp a JOIN #days b ON a.attend_date = b.attend_date

	-- Get course and user info
	SET @q += '
	select a.*, isnull(c.course_code, '''') as course_code, isnull(d.classroom_code, '''') as classroom_code, isnull(d.shift_code, '''') as shift_code
			, isnull(u.username, '''') as username, isnull(u.nickname, '''') as nickname
		from #data a
			left join coursegroup c on a.course_group_id = c.course_group_id
			left join classroomshift d on c.classroomshift_id = d.classroomshift_id
			left join sysuser u on a.student_id = u.user_id
	drop table #data'
	EXEC (@q)

	-- Header info
	SELECT *
	FROM #days
	DROP TABLE #tmp
END
GO

EXEC AttendanceDetailReport 100
GO

-- Chạy từ đoạn này để update đợt này nha
-- Update 08/08/2024
ALTER TABLE Attendance ADD attend_image_path VARCHAR(128) NULL
ALTER TABLE Attendance ADD attend_type TINYINT NULL

GO
ALTER VIEW vattendance
AS
	SELECT a.*, ISNULL(b.username, '') AS username, ISNULL(b.nickname, '') AS nickname
			, ISNULL(c.course_code, '') AS course_code, ISNULL(d.course_name, '') AS course_name
			, CONVERT(VARCHAR(10), a.attend_date, 103) AS attend_date_dmy, CONVERT(VARCHAR(5), a.attend_date, 103) AS attend_date_dm
	FROM Attendance a
		LEFT JOIN SysUser b ON a.student_id = b.user_id
		LEFT JOIN CourseGroup c ON a.course_group_id = c.course_group_id
		LEFT JOIN Course d ON c.course_code = d.course_code
GO
SELECT *
FROM vattendance
GO

ALTER PROCEDURE UpdateAttendanceFromRawData
	@course_group_id INT,
	@attend_date DATE,
	@user_id INT
AS
BEGIN
	SET NOCOUNT ON

	DECLARE @CurrDate DATETIME = GETDATE()

	-- Student in group list
	SELECT student_id
	INTO #student
	FROM CourseGroupStudentList
	WHERE course_group_id = @course_group_id

	-- Get attendant data
	SELECT *
	INTO #tmp
	FROM AttendanceRawData
	WHERE course_group_id = @course_group_id AND attend_date = @attend_date

	-- Struct
	SELECT TOP 0
		a.*
	INTO #data
	FROM Attendance a
	WHERE 1=0

	-- Insert student with it attendant state
	INSERT INTO #data
		(student_id, course_group_id, attend_date, attend_yn, enter_time, leave_time, attend_image_path, attend_type)
			SELECT a.student_id, a.course_group_id, a.attend_date, 1, a.attend_time, '00:00', a.attend_image_path, a.attend_type
		FROM #tmp a
		WHERE a.attend_type % 2 = 0
	UNION ALL
		SELECT a.student_id, @course_group_id, @attend_date, 0, '00:00', '00:00', '', 0
		FROM #student a
		WHERE NOT EXISTS(SELECT 1
		FROM #tmp x
		WHERE a.student_id = x.student_id)

	-- Update leave time
	UPDATE #data SET leave_time = ISNULL(b.attend_time, '00:00') FROM #data a LEFT JOIN #tmp b ON a.student_id = b.student_id AND a.course_group_id = b.course_group_id AND a.attend_date = b.attend_date AND a.attend_type = b.attend_type - 1 WHERE a.attend_type % 2 = 0

	-- Insert student who miss start of class
	INSERT INTO #data
		(student_id, course_group_id, attend_date, attend_yn, enter_time, leave_time, attend_image_path, attend_type)
	SELECT a.student_id, a.course_group_id, a.attend_date, 1, '00:00', a.attend_time, a.attend_image_path, a.attend_type - 1
	FROM #tmp a WITH(NOLOCK)
	WHERE a.attend_type % 2 = 1 AND NOT EXISTS(SELECT 1
		FROM #tmp x WITH(NOLOCK)
		WHERE a.student_id = x.student_id AND a.course_group_id = x.course_group_id AND a.attend_date = x.attend_date AND a.attend_type - 1 = x.attend_type)

	UPDATE #data SET note = '', status = 1, creator_id = @user_id, updater_id = @user_id, create_time = @CurrDate, update_time = @CurrDate

	BEGIN TRY
		BEGIN TRANSACTION;
			
			DELETE Attendance FROM Attendance a WHERE EXISTS(SELECT 1
	FROM #data x
	WHERE a.course_group_id = x.course_group_id AND a.attend_date = x.attend_date)
			INSERT INTO Attendance
	SELECT *
	FROM #data

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SELECT ERROR_MESSAGE() AS [message], ERROR_PROCEDURE() AS [error_store], 'PullAttendanceRawData' AS [store]
		ROLLBACK TRANSACTION
	END CATCH;

	DROP TABLE #student, #tmp, #data
END
GO

-- 12/08/2024 Update recog multi face
GO
CREATE TABLE SysUserFace
(
	[user_face_id] INT IDENTITY(1, 1) NOT NULL,
	[user_id] INT NOT NULL,
	[face_image_path] VARCHAR(128) NULL,
	[status] BIT NULL,
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)
ALTER TABLE SysUserFace ADD CONSTRAINT PK_SysUserFace PRIMARY KEY CLUSTERED(user_face_id) ON [PRIMARY]

GO
INSERT INTO SysUserFace
	(user_id, face_image_path, status, creator_id, updater_id, create_time, update_time)
VALUES
	(900, 'https://res.cloudinary.com/diges8hpb/image/upload/v1722777332/Attendance_System/52000900_attendanceSystem_0123456789.jpg', 1, 1, 1, '2024-08-11 19:29:19.457', '2024-08-11 19:29:19.457'),
	(900, 'https://res.cloudinary.com/diges8hpb/image/upload/v1723378237/52000900_attendanceSystem_0123456789_02_vefz5z.jpg', 1, 1, 1, '2024-08-11 19:29:19.457', '2024-08-11 19:29:19.457')
GO

CREATE VIEW vSysUserFace
AS
	SELECT a.user_face_id, a.user_id, b.username, b.nickname, a.face_image_path
	FROM SysUserFace a JOIN SysUser b ON a.user_id = b.user_id
GO

-- 13/08 view All Course Groups Student

CREATE VIEW ViewCourseGroupInfoByStudentId
AS
	SELECT
		cg.course_group_id,
		cg.group_code,
		cg.course_code,
		cls.shift_code,
		cls.classroom_code,
		cgsl.student_id,
		cgsl.total_absent,
		cgsl.ban_yn,
		cgsl.status,
		sh.week_from,
		sh.week_to,
		sh.week_day,
		su.nickname,
		su.avatar_path,
		c.course_name,
		cg.semester_year_id
	FROM
		CourseGroupStudentList cgsl
		INNER JOIN CourseGroup cg ON cgsl.course_group_id = cg.course_group_id
		INNER JOIN Schedule sh ON cgsl.course_group_id = sh.course_group_id
		INNER JOIN ClassRoomShift cls ON cg.classroomshift_id = cls.classroomshift_id
		INNER JOIN sysUser su ON cg.teacher_id = su.user_id
		INNER JOIN Course c ON cg.course_code = c.course_code;
Go
--SELECT * FROM ViewCourseGroupInfoByStudentId WHERE student_id = 65 and semester_year_id = 6


-------- PHUOCTL
--15/08/2024 - Thêm option không kéo lại dữ liệu nếu đã có dữ liệu của ngày đó
ALTER PROCEDURE UpdateAttendanceFromRawData
	@course_group_id INT,
	@attend_date DATE,
	@user_id INT,
	@force_update_yn BIT = 0
-- 0. Update if not exists data, 1. Always update
AS
BEGIN
	SET NOCOUNT ON

	-- Check if attendance data already exists and force_update_yn = 0. Don't update
	IF @force_update_yn = 0 AND EXISTS(SELECT 1
		FROM Attendance x
		WHERE x.course_group_id = @course_group_id AND x.attend_date = @attend_date) BEGIN
		SELECT 'Update cancel' AS message
		RETURN;
	END

	DECLARE @CurrDate DATETIME = GETDATE()

	-- Student in group list
	SELECT student_id
	INTO #student
	FROM CourseGroupStudentList
	WHERE course_group_id = @course_group_id

	-- Get attendant data
	SELECT *
	INTO #tmp
	FROM AttendanceRawData
	WHERE course_group_id = @course_group_id AND attend_date = @attend_date

	-- Struct
	SELECT TOP 0
		a.*
	INTO #data
	FROM Attendance a
	WHERE 1=0

	-- Insert student with it attendant state
	INSERT INTO #data
		(student_id, course_group_id, attend_date, attend_yn, enter_time, leave_time, attend_image_path, attend_type)
			SELECT a.student_id, a.course_group_id, a.attend_date, 1, a.attend_time, '00:00', a.attend_image_path, a.attend_type
		FROM #tmp a
		WHERE a.attend_type % 2 = 0
	UNION ALL
		SELECT a.student_id, @course_group_id, @attend_date, 0, '00:00', '00:00', '', 0
		FROM #student a
		WHERE NOT EXISTS(SELECT 1
		FROM #tmp x
		WHERE a.student_id = x.student_id)

	-- Update leave time
	UPDATE #data SET leave_time = ISNULL(b.attend_time, '00:00') FROM #data a LEFT JOIN #tmp b ON a.student_id = b.student_id AND a.course_group_id = b.course_group_id AND a.attend_date = b.attend_date AND a.attend_type = b.attend_type - 1 WHERE a.attend_type % 2 = 0

	-- Insert student who miss start of class
	INSERT INTO #data
		(student_id, course_group_id, attend_date, attend_yn, enter_time, leave_time, attend_image_path, attend_type)
	SELECT a.student_id, a.course_group_id, a.attend_date, 1, '00:00', a.attend_time, a.attend_image_path, a.attend_type - 1
	FROM #tmp a WITH(NOLOCK)
	WHERE a.attend_type % 2 = 1 AND NOT EXISTS(SELECT 1
		FROM #tmp x WITH(NOLOCK)
		WHERE a.student_id = x.student_id AND a.course_group_id = x.course_group_id AND a.attend_date = x.attend_date AND a.attend_type - 1 = x.attend_type)

	UPDATE #data SET note = '', status = 1, creator_id = @user_id, updater_id = @user_id, create_time = @CurrDate, update_time = @CurrDate

	BEGIN TRY
		BEGIN TRANSACTION;
			
			DELETE Attendance FROM Attendance a WHERE EXISTS(SELECT 1
	FROM #data x
	WHERE a.course_group_id = x.course_group_id AND a.attend_date = x.attend_date)
			INSERT INTO Attendance
	SELECT *
	FROM #data

			SELECT 'Update finish' AS message

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SELECT ERROR_MESSAGE() AS [message], ERROR_PROCEDURE() AS [error_store], 'PullAttendanceRawData' AS [store]
		ROLLBACK TRANSACTION
	END CATCH;

	DROP TABLE #student, #tmp, #data
END
GO

-- 17-08 view All studen course group
create view viewAllStudentInCourseGroup
as
	select cg.teacher_id, cg.semester_year_id, cg.course_group_id, cg.status,
		cgsl.student_id, cgsl.total_absent, cgsl.ban_yn,
		sy.nickname, sy.username, sy.email
	from
		CourseGroup as cg
		inner join CourseGroupStudentList as cgsl on cgsl.course_group_id = cg.course_group_id
		right join SysUser as sy on cgsl.student_id = sy.user_id
Go

-- 16/08 --PHUOCTL-- Thêm chức năng update total absent
-- Function convert string to table
CREATE FUNCTION StringToTable(@s NVARCHAR(4000), @split CHAR(1))
RETURNS @table TABLE(stt INT IDENTITY(1, 1),
	val VARCHAR(32))
AS -- Split string to table, skip space and empty string
BEGIN
	DECLARE @val VARCHAR(32), @i INT
	IF LEFT(@s, 1) = ',' SET @s = SUBSTRING(@s, 1, LEN(@s))
	IF @split = '' SET @split = ','

	SET @i = CHARINDEX(@split, @s)
	WHILE @i != 0 OR LEFT(@s, 1) = ',' BEGIN
		SET @val = LTRIM(RTRIM(SUBSTRING(@s, 0, @i)))
		SET @s = SUBSTRING(@s, @i + 1, LEN(@s))
		SET @i = CHARINDEX(@split, @s)
		INSERT INTO @table
			(val)
		SELECT @val
		WHERE @val <> ''
	END

	SET @val = LTRIM(RTRIM(@s))
	INSERT INTO @table
		(val)
	SELECT @val
	WHERE @val <> ''
	RETURN
END
GO
select *
from dbo.StringToTable('123, 124, 125, 126', ',')
GO

-- Store cập nhật tổng số buổi vắng của sinh viên
CREATE PROCEDURE UpdateTotalAbsent
	@course_group_id INT,
	@user_id_list VARCHAR(256) = ''
-- Chuỗi danh sách student_id muốn cập nhật cách nhau bằng dấu phẩy
AS
BEGIN
	SET NOCOUNT ON

	-- Key
	SELECT a.val AS user_id
	INTO #userlist
	FROM dbo.StringToTable(@user_id_list, ',') a
	GROUP BY a.val

	-- Get total absent
	SELECT a.course_group_id, a.student_id, SUM(IIF(a.attend_yn = 0, 1, 0)) AS total_absent
	INTO #total
	FROM Attendance a
	WHERE a.course_group_id = @course_group_id AND (@user_id_list = '' OR EXISTS(SELECT 1
		FROM #userlist x
		WHERE a.student_id = x.user_id))
	GROUP BY a.course_group_id, a.student_id

	-- Update
	UPDATE CourseGroupStudentList SET total_absent = b.total_absent FROM CourseGroupStudentList a JOIN #total b ON a.course_group_id = b.course_group_id AND a.student_id = b.student_id
	DROP TABLE #userlist, #total
END
GO

ALTER VIEW ViewCourseGroupInfoByStudentId
AS
	SELECT
		cg.course_group_id,
		cg.group_code,
		cg.course_code,
		ISNULL(cls.shift_code, '') AS shift_code,
		ISNULL(cls.classroom_code, '') AS classroom_code,
		ISNULL(s.start_time, '00:00') AS start_time,
		ISNULL(s.end_time, '00:00') AS end_time,
		cgsl.student_id,
		cgsl.total_absent,
		cgsl.ban_yn,
		cgsl.status,
		ISNULL(sh.week_from, 0) AS week_from,
		ISNULL(sh.week_to, 0) AS week_to,
		ISNULL(sh.week_day, 0) AS week_day,
		ISNULL(sh.exclude_week, '') AS exclude_week,
		ISNULL(sh.total_shift, 0) AS total_shift,
		ISNULL(su.nickname, '') AS nickname,
		ISNULL(su.avatar_path, '') AS avatar_path,
		ISNULL(c.course_name, '') AS course_name,
		cg.semester_year_id
	FROM
		CourseGroupStudentList cgsl
		INNER JOIN CourseGroup cg ON cgsl.course_group_id = cg.course_group_id
		LEFT JOIN Schedule sh ON cgsl.course_group_id = sh.course_group_id
		LEFT JOIN ClassRoomShift cls ON cg.classroomshift_id = cls.classroomshift_id
		LEFT JOIN Shift s on cls.shift_code = s.shift_code
		LEFT JOIN sysUser su ON cg.teacher_id = su.user_id
		LEFT JOIN Course c ON cg.course_code = c.course_code;
Go


-- 18-08 Update total-absent and checkstatus for sending mail
ALTER PROCEDURE UpdateTotalAbsent
	@course_group_id INT,
	@user_id_list VARCHAR(256) = ''
-- Chuỗi danh sách student_id muốn cập nhật cách nhau bằng dấu phẩy
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @total_shift NUMERIC(19, 5) = 0

	-- Key
	SELECT a.val AS user_id
	INTO #userlist
	FROM dbo.StringToTable(@user_id_list, ',') a
	GROUP BY a.val

	-- Get course total shift
	SELECT @total_shift = a.total_shift
	FROM Schedule a
	WHERE a.course_group_id = @course_group_id
	IF @total_shift = 0 SELECT @total_shift = COUNT(1)
	FROM Attendance a
	WHERE a.course_group_id = @course_group_id
	GROUP BY a.course_group_id, a.student_id

	-- Get total absent
	SELECT a.course_group_id, a.student_id, SUM(IIF(a.attend_yn = 0, 1, 0)) AS total_absent, CAST(0 AS NUMERIC(19, 5)) AS absent_ratio
	INTO #total
	FROM Attendance a
	WHERE a.course_group_id = @course_group_id AND (@user_id_list = '' OR EXISTS(SELECT 1
		FROM #userlist x
		WHERE a.student_id = x.user_id))
	GROUP BY a.course_group_id, a.student_id

	UPDATE #total SET absent_ratio = IIF(@total_shift = 0, 0, total_absent / @total_shift)

	-- Update
	UPDATE CourseGroupStudentList SET total_absent = b.total_absent, ban_yn = IIF(b.absent_ratio > 0.2, 1, 0)
		FROM CourseGroupStudentList a JOIN #total b ON a.course_group_id = b.course_group_id AND a.student_id = b.student_id

	DROP TABLE #userlist, #total
END
GO

GO

ALTER PROCEDURE sp_CheckAttendanceStatus
	@course_group_id INT,
	@student_id INT = 0
AS
BEGIN
	DECLARE @total_shift NUMERIC(19, 5) = 0

	-- Get course total shift
	SELECT @total_shift = a.total_shift
	FROM Schedule a
	WHERE a.course_group_id = @course_group_id
	IF @total_shift = 0 SELECT @total_shift = COUNT(1)
	FROM Attendance a
	WHERE a.course_group_id = @course_group_id
	GROUP BY a.course_group_id, a.student_id

	-- Get course group and student data
	SELECT a.course_group_id, a.student_id, a.total_absent, IIF(@total_shift = 0, 0, a.total_absent / @total_shift) AS absent_ratio, CAST('' AS VARCHAR(32)) AS type
	INTO #info
	FROM CourseGroupStudentList a
	WHERE a.course_group_id = @course_group_id AND @student_id IN (a.student_id, 0)

	-- Identify warning type
	UPDATE #info SET type = CASE
		WHEN absent_ratio > 0.2 THEN 'ban'
		WHEN absent_ratio > 0.1 THEN 'warning'
		ELSE 'no' END

	-- Get course group and student info
	SELECT a.course_group_id, ISNULL(b.course_code, '') AS course_code, ISNULL(b.group_code, '') AS group_code, ISNULL(c.course_name, '') AS course_name
			, a.student_id, ISNULL(su.email, '') AS student_email, ISNULL(su.nickname, '') AS student_name, a.total_absent, a.absent_ratio, a.type
	FROM #info a JOIN CourseGroup b ON a.course_group_id = b.course_group_id AND b.status = 1
		LEFT JOIN Course c ON b.course_code = c.course_code
		LEFT JOIN SysUser su ON a.student_id = su.user_id
	WHERE a.type <> 'no'
	DROP TABLE #info
END
GO

-- 23/08/2024 Update complain, attendance state change request
GO
CREATE TABLE AttendanceRequest
(
	[request_id] INT IDENTITY(1, 1) NOT NULL,
	[student_id] INT NOT NULL,
	[course_group_id] INT NOT NULL,
	[attend_date] DATE NOT NULL,
	[attend_type] TINYINT NOT NULL,
	[proof_image_path] VARCHAR(128) NULL,
	[file_link] VARCHAR(256) NULL,
	[content] NVARCHAR(2048) NULL,
	-- Content of request
	[response] NVARCHAR(2048) NULL,
	-- Aprrover response to request
	[request_type] TINYINT,
	--0: Attendance
	[status] TINYINT NULL,
	-- 0: Not use, 1: Pending, 2: Approved, 9: Cancel
	[creator_id] INT NULL,
	[updater_id] INT NULL,
	[create_time] DATETIME NULL,
	[update_time] DATETIME NULL
)
ALTER TABLE AttendanceRequest ADD CONSTRAINT PK_AttendanceRequest PRIMARY KEY CLUSTERED(student_id, course_group_id, attend_date, attend_type) ON [PRIMARY]
ALTER TABLE AttendanceRequest ADD CONSTRAINT FK_AttendanceRequest_UserStudent FOREIGN KEY(student_id) REFERENCES SysUser(user_id)
ALTER TABLE AttendanceRequest ADD CONSTRAINT FK_AttendanceRequest_CourseGroup FOREIGN KEY(course_group_id) REFERENCES CourseGroup(course_group_id)
GO

GO
CREATE VIEW vAttendanceRequest
AS
	SELECT a.*, ISNULL(b.teacher_id, 0) AS teacher_id, u0.nickname AS nickname0
			, N'Yêu cầu điểm danh sinh viên ' + ISNULL(d.username, '') + N', nhóm môn ' + ISNULL(b.course_code + ' - ' + b.group_code, '') + N', ngày ' + CONVERT(VARCHAR(10), a.attend_date, 103) AS title
	FROM AttendanceRequest a
		LEFT JOIN CourseGroup b ON a.course_group_id = b.course_group_id
		LEFT JOIN Course c ON b.course_code = c.course_code
		LEFT JOIN SysUser d ON a.student_id = d.user_id
		LEFT JOIN SysUser u0 ON a.creator_id = u0.user_id
GO

CREATE PROCEDURE sp_AfterUpdateAttendanceRequest
	@request_id INT,
	@status TINYINT,
	@user_id INT
AS
BEGIN
	DECLARE @course_group_id INT, @student_id INT, @dt DATETIME
	SET @dt = GETDATE()

	IF NOT EXISTS(SELECT 1
	FROM vAttendanceRequest x
	WHERE x.request_id = @request_id AND x.teacher_id = @user_id) BEGIN
		SELECT 0 AS permission, 'Not allow' AS message
		RETURN
	END

	-- Update request status
	UPDATE AttendanceRequest SET status = @status, updater_id = @user_id, update_time = @dt WHERE request_id = @request_id

	IF @status = 2 BEGIN
		-- Update attendance state
		UPDATE Attendance SET attend_yn = 1, note = N'Duyệt yêu cầu điểm danh.', updater_id = @user_id, update_time = @dt
			FROM Attendance a WHERE EXISTS(SELECT 1
		FROM AttendanceRequest x
		WHERE x.request_id = @request_id AND a.student_id = x.student_id AND a.course_group_id = x.course_group_id AND a.attend_date = x.attend_date AND a.attend_type = x.attend_type)

		-- Update total absent
		SELECT @course_group_id = @course_group_id
		FROM AttendanceRequest a
		WHERE a.request_id = @request_id
		EXEC UpdateTotalAbsent @course_group_id, @student_id
	END
END
GO

--- Update late_yn
ALTER TABLE Attendance ADD late_yn BIT NULL
Go
UPDATE Attendance SET late_yn = 0
ALTER TABLE Attendance ALTER COLUMN late_yn BIT NOT NULL
GO

ALTER PROCEDURE UpdateTotalAbsent
	@course_group_id INT,
	@user_id_list VARCHAR(256) = ''
-- Chuỗi danh sách student_id muốn cập nhật cách nhau bằng dấu phẩy
AS
BEGIN
	SET NOCOUNT ON
	DECLARE @total_shift NUMERIC(19, 5) = 0

	-- Key
	SELECT a.val AS user_id
	INTO #userlist
	FROM dbo.StringToTable(@user_id_list, ',') a
	GROUP BY a.val

	-- Get course total shift
	SELECT @total_shift = a.total_shift
	FROM Schedule a
	WHERE a.course_group_id = @course_group_id
	IF @total_shift = 0 SELECT @total_shift = COUNT(1)
	FROM Attendance a
	WHERE a.course_group_id = @course_group_id
	GROUP BY a.course_group_id, a.student_id

	-- Get total absent
	SELECT a.course_group_id, a.student_id, SUM(IIF(a.attend_yn = 0, 1, IIF(a.late_yn = 1, 0.5, 0))) AS total_absent, CAST(0 AS NUMERIC(19, 5)) AS absent_ratio
	INTO #total
	FROM Attendance a
	WHERE a.course_group_id = @course_group_id AND (@user_id_list = '' OR EXISTS(SELECT 1
		FROM #userlist x
		WHERE a.student_id = x.user_id))
	GROUP BY a.course_group_id, a.student_id

	UPDATE #total SET absent_ratio = IIF(@total_shift = 0, 0, total_absent / @total_shift)

	-- Update
	UPDATE CourseGroupStudentList SET total_absent = b.total_absent, ban_yn = IIF(b.absent_ratio > 0.2, 1, 0)
		FROM CourseGroupStudentList a JOIN #total b ON a.course_group_id = b.course_group_id AND a.student_id = b.student_id

	DROP TABLE #userlist, #total
END
GO

-- Store kéo dữ liệu từ dữ liệu thô sang bảng điểm danh chính
ALTER PROCEDURE UpdateAttendanceFromRawData
	@course_group_id INT,
	@attend_date DATE,
	@user_id INT,
	@force_update_yn BIT = 0
-- 0. Update if not exists data, 1. Always update
AS
BEGIN
	SET NOCOUNT ON
	-- Check if attendance data already exists and force_update_yn = 0. Don't update
	IF @force_update_yn = 0 AND EXISTS(SELECT 1
		FROM Attendance x
		WHERE x.course_group_id = @course_group_id AND x.attend_date = @attend_date) BEGIN
		SELECT 'Update cancel' AS message
		RETURN;
	END

	DECLARE @CurrDate DATETIME = GETDATE(), @LateTime CHAR(5)

	-- Get course late time
	SELECT @LateTime = CONVERT(CHAR(5), DATEADD(MINUTE, 15, CAST(c.start_time AS TIME)), 114)
	FROM CourseGroup a
		JOIN ClassRoomShift b ON a.classroomshift_id = b.classroomshift_id
		JOIN Shift c ON b.shift_code = c.shift_code
	WHERE a.course_group_id = @course_group_id

	-- Student in group list
	SELECT student_id
	INTO #student
	FROM CourseGroupStudentList
	WHERE course_group_id = @course_group_id

	-- Get attendant data
	SELECT *
	INTO #tmp
	FROM AttendanceRawData
	WHERE course_group_id = @course_group_id AND attend_date = @attend_date

	-- Struct
	SELECT TOP 0
		a.*
	INTO #data
	FROM Attendance a
	WHERE 1=0

	-- Insert student with it attendant state
	INSERT INTO #data
		(student_id, course_group_id, attend_date, attend_yn, late_yn, enter_time, leave_time, attend_image_path, attend_type)
			SELECT a.student_id, a.course_group_id, a.attend_date, 1, 0, a.attend_time, '00:00', a.attend_image_path, a.attend_type
		FROM #tmp a
		WHERE a.attend_type % 2 = 0
	UNION ALL
		SELECT a.student_id, @course_group_id, @attend_date, 0, 0, '00:00', '00:00', '', 0
		FROM #student a
		WHERE NOT EXISTS(SELECT 1
		FROM #tmp x
		WHERE a.student_id = x.student_id)

	-- Update leave time
	UPDATE #data SET leave_time = ISNULL(b.attend_time, '00:00') FROM #data a LEFT JOIN #tmp b ON a.student_id = b.student_id AND a.course_group_id = b.course_group_id AND a.attend_date = b.attend_date AND a.attend_type = b.attend_type - 1 WHERE a.attend_type % 2 = 0

	-- Insert student who miss start of class
	INSERT INTO #data
		(student_id, course_group_id, attend_date, attend_yn, late_yn, enter_time, leave_time, attend_image_path, attend_type)
	SELECT a.student_id, a.course_group_id, a.attend_date, 1, 0, '00:00', a.attend_time, a.attend_image_path, a.attend_type - 1
	FROM #tmp a WITH(NOLOCK)
	WHERE a.attend_type % 2 = 1 AND NOT EXISTS(SELECT 1
		FROM #tmp x WITH(NOLOCK)
		WHERE a.student_id = x.student_id AND a.course_group_id = x.course_group_id AND a.attend_date = x.attend_date AND a.attend_type - 1 = x.attend_type)

	UPDATE #data SET late_yn = 1 WHERE attend_yn = 1 AND @LateTime IS NOT NULL AND enter_time > @LateTime
	UPDATE #data SET note = '', status = 1, creator_id = @user_id, updater_id = @user_id, create_time = @CurrDate, update_time = @CurrDate

	BEGIN TRY
		BEGIN TRANSACTION;
			
			DELETE Attendance FROM Attendance a WHERE EXISTS(SELECT 1
	FROM #data x
	WHERE a.course_group_id = x.course_group_id AND a.attend_date = x.attend_date)
			INSERT INTO Attendance
	SELECT *
	FROM #data

			SELECT 'Update finish' AS message

		COMMIT TRANSACTION;
	END TRY
	BEGIN CATCH
		SELECT ERROR_MESSAGE() AS [message], ERROR_PROCEDURE() AS [error_store], 'PullAttendanceRawData' AS [store]
		ROLLBACK TRANSACTION
	END CATCH;

	DROP TABLE #student, #tmp, #data
END
GO

-- View nào lấy lên hông đủ cột thì chạy cái này nha Duy
EXEC sys.sp_refreshview 'vAttendance' -- Tên view
GO

-- 18/10/2024 Thêm cột 
ALTER TABLE SysUserFace ADD uuid VARCHAR(36) NULL