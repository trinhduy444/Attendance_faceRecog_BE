-- 28/07/2024
-- Update add 
ALTER TABLE Attendance DROP COLUMN attendance_id
ALTER TABLE Attendance ADD [attend_yn] BIT NOT NULL
GO

-- Dữ liệu phòng học
INSERT INTO Classroom(classroom_code, capacity, floor, description, status, creator_id, updater_id, create_time, update_time) VALUES
	('C201', 50, 2, 'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567'),
	('C202', 50, 2, 'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567'),
	('C203', 50, 2, 'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567'),
	('C204', 50, 2, 'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567'),
	('C205', 50, 2, 'Phòng học có máy chiếu', 1, 1, 1, '2024-07-28 18:42:33.567', '2024-07-28 18:42:33.567')
GO

-- Thêm người dùng để test
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
	SELECT student_id INTO #student FROM CourseGroupStudentList WHERE course_group_id = @course_group_id

	-- Get attendant data
	SELECT * INTO #tmp FROM AttendanceRawData WHERE course_group_id = @course_group_id AND attend_date = @attend_date

	-- Struct
	SELECT TOP 0 a.* INTO #data FROM Attendance a WHERE 1=0

	-- Insert student with it attendant state
	INSERT INTO #data(student_id, course_group_id, attend_date, attend_yn, enter_time)
		SELECT a.student_id, a.course_group_id, a.attend_date, 1, a.attend_time FROM #tmp a WHERE a.attend_type IN (0, 1)
		UNION ALL
		SELECT a.student_id, @course_group_id, @attend_date, 0, '00:00' FROM #student a WHERE NOT EXISTS(SELECT 1 FROM #tmp x WHERE a.student_id = x.student_id)

	UPDATE #data SET leave_time = '00:00', note = '', status = 1, creator_id = @user_id, updater_id = @user_id, create_time = @CurrDate, update_time = @CurrDate

	BEGIN TRY
		BEGIN TRANSACTION;
			
			DELETE Attendance FROM Attendance a WHERE EXISTS(SELECT 1 FROM #data x WHERE a.course_group_id = x.course_group_id AND a.attend_date = x.attend_date)
			INSERT INTO Attendance SELECT * FROM #data

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
SELECT * FROM Attendance
GO

-- View tạo để lấy dữ liệu (Nếu chỉ join thì không cần viết store á Duy)
CREATE VIEW vattendance
AS
	SELECT a.*, ISNULL(b.username, '') AS username, ISNULL(b.nickname, '') AS nickname
	FROM Attendance a
		LEFT JOIN SysUser b ON a.student_id = b.user_id
GO
SELECT * FROM vattendance
GO

-- Store báo cáo tổng hợp dữ liệu điểm danh
CREATE PROCEDURE AttendanceSummaryReport
	@attend_date1 DATE = NULL, -- Filter date from
	@attend_date2 DATE = NULL, -- Filter date to
	@student_id INT = 0, -- Filter by student
	@course_group_id INT = 0 -- Filter by course group
AS
BEGIN
	SET NOCOUNT ON

	-- Data
	SELECT a.* INTO #tmp FROM Attendance a WHERE @student_id IN (a.student_id, 0) AND @course_group_id IN (a.course_group_id, 0)
		AND (@attend_date1 IS NULL OR a.attend_date >= @attend_date1) AND (@attend_date2 IS NULL OR a.attend_date <= @attend_date2)

	-- Course current total day, attend absent
	SELECT a.course_group_id, COUNT(DISTINCT a.attend_date) AS total_day INTO #totalDay FROM #tmp a GROUP BY a.course_group_id
	SELECT a.course_group_id, a.student_id, SUM(IIF(a.attend_yn = 1, 1, 0)) AS total_attend, SUM(IIF(a.attend_yn = 0, 1, 0)) AS total_absent
		INTO #totalAttend FROM #tmp a GROUP BY a.course_group_id, a.student_id

	-- Report
	SELECT 5 AS xorder, a.course_group_id, ISNULL(c.course_code, '') AS course_code, ISNULL(d.classroom_code, '') AS classroom_code, ISNULL(d.shift_code, '') AS shift_code
			, a.student_id, ISNULL(u.username, '') AS username, ISNULL(u.nickname, '') AS nickname
			, ISNULL(b.total_day, 0) AS total_day, a.total_attend, a.total_absent
		INTO #report FROM #totalAttend a
			LEFT JOIN #totalDay b ON a.course_group_id = b.course_group_id
			LEFT JOIN CourseGroup c ON a.course_group_id = c.course_group_id
			LEFT JOIN ClassRoomShift d ON c.classroomshift_id = d.classroomshift_id
			LEFT JOIN SysUser u ON a.student_id = u.user_id
			
	-- Group row
	INSERT INTO #report(xorder, course_group_id, course_code, classroom_code, shift_code, student_id, username, nickname, total_day, total_attend, total_absent)
		SELECT 4, a.course_group_id, MAX(a.course_code), MAX(a.classroom_code), MAX(a.shift_code), 0, '', '', 0, 0, 0
			FROM #report a GROUP BY a.course_group_id
	
	SELECT * FROM #report ORDER BY course_group_id, xorder
	DROP TABLE #tmp, #totalAttend, #report
END
GO

EXEC AttendanceSummaryReport
GO

-- Store báo cáo chi tiết dữ liệu điểm danh theo nhóm môn
CREATE PROCEDURE AttendanceDetailReport
	@course_group_id INT, -- Filter by course group, not allow blank
	@student_id INT = 0 -- Filter by student
AS
BEGIN
	SET NOCOUNT ON

	DECLARE @q NVARCHAR(MAX), @xCols NVARCHAR(4000), @xValues NVARCHAR(4000)
	SELECT @q = '', @xCols = '', @xValues = ''

	-- Data
	SELECT a.* INTO #tmp FROM Attendance a WHERE a.course_group_id = @course_group_id AND @student_id IN (a.student_id, 0)

	-- Total day
	SELECT ROW_NUMBER() OVER(ORDER BY a.attend_date) AS stt, a.attend_date, CAST('' AS VARCHAR(32)) AS xCol, CAST('' AS NVARCHAR(256)) AS xheader INTO #days FROM #tmp a GROUP BY a.attend_date ORDER BY a.attend_date
	UPDATE #days SET xCol = 'col' + RTRIM(stt), xheader = N'Buổi ' + RTRIM(stt)
	SELECT @xCols += ', ' + a.xCol, @xValues += ', 0' FROM #days a ORDER BY a.stt

	-- Report struct
	SELECT @q = 'select top 0 a.course_group_id, a.student_id' + REPLACE(@xCols, ', ', ', cast(0 as tinyint) as ') + ' into #data from attendance a where 1=0
	insert into #data (course_group_id, student_id' + @xCols + ') select a.course_group_id, a.student_id' + @xValues + ' from #tmp a group by a.course_group_id, a.student_id'
	
	-- Update values
	SELECT @q += '
	update #data set ' + b.xCol + ' = b.attend_yn from #data a join #tmp b on a.course_group_id = b.course_group_id and a.student_id = b.student_id
		and b.attend_date = ''' + CONVERT(VARCHAR(8), a.attend_date, 112) + '''
	' FROM #tmp a JOIN #days b ON a.attend_date = b.attend_date

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
	SELECT * FROM #days
	DROP TABLE #tmp
END
GO

EXEC AttendanceDetailReport 100
GO