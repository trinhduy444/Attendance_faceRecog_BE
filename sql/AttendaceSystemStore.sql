CREATE PROCEDURE TableLoadingPagination
	@Table VARCHAR(32),
	@OtherJoins VARCHAR(4000) = '',
	@OtherFields VARCHAR(4000) = '',
	@Order VARCHAR(4000) = '',
	@Search VARCHAR(4000) = '',
	@PageNumber INT = 1,
	@RowPerPage INT = 50
AS
BEGIN
	DECLARE @q NVARCHAR(MAX), @Offset INT
	SELECT @Offset = (@PageNumber - 1) * @RowPerPage

	IF @OtherFields <> '' SET @OtherFields = ', ' + @OtherFields
	-- Default value
	IF @Order = '' SET @Order = '1'
	IF @Search = '' SET @Search = '(1=1)'
	IF @PageNumber <= 0 SET @PageNumber = 1
	IF @RowPerPage <= 0 SET @RowPerPage = 50

	SET @q = '
		-- Page data
		select a.* @@OtherFields
			into #v from @@table a @@OtherJoins
			where @@Search
			order by @@Order
		offset @@Offset rows fetch next @@RowPerPage rows only
	
		select * from #v order by @@Order

		-- Page info
		declare @TotalPage int, @PageTotalRow int, @TotalRow int
		
		select @PageTotalRow = count(1) from #v
		select @TotalRow = count(1) from @@table
		select @TotalPage = ceiling((1.0 * @TotalRow) / @@RowPerPage)

		select iif(@TotalPage = 0, 1, @TotalPage) as total_page, @PageTotalRow as page_total_row, @TotalRow as total_row
		drop table #v
	'

	-- Replace params
	SET @q = REPLACE(@q, '@@table', @Table)
	SET @q = REPLACE(REPLACE(@q, '@@OtherJoins', @OtherJoins), '@@OtherFields', @OtherFields)
	SET @q = REPLACE(REPLACE(@q, '@@Order', @Order), '@@Search', @Search)
	SET @q = REPLACE(REPLACE(@q, '@@RowPerPage', RTRIM(@RowPerPage)), '@@Offset', RTRIM(@Offset))
	PRINT @q
	EXEC (@q)
END
GO

--- Procedure auto teacher's username(Duy khong biet vì sao nó bị đỏ lè nên tắt comment add trong sql nhé Phước)

-- CREATE PROCEDURE GenerateTeacherUsername
-- AS
-- BEGIN
--     IF EXISTS (SELECT 1 FROM SysUser WHERE role_id = 2)
--     BEGIN
--         DECLARE @user_id NVARCHAR(50)
--         DECLARE @faculty_id INT
--         DECLARE @username NVARCHAR(50)

--         DECLARE teacher_cursor CURSOR FOR
--         SELECT user_id, faculty_id
--         FROM SysUser
--         WHERE role_id = 2

--         OPEN teacher_cursor
--         FETCH NEXT FROM teacher_cursor INTO @user_id, @faculty_id

--         WHILE @@FETCH_STATUS = 0
--         BEGIN
--             SET @username = 'GV' + CAST(@faculty_id AS NVARCHAR(5)) + @user_id 
            
--             -- Update username for each teacher
--             UPDATE SysUser
--             SET username = @username
--             WHERE user_id = @user_id

--             FETCH NEXT FROM teacher_cursor INTO @user_id, @faculty_id
--         END

--         CLOSE teacher_cursor
--         DEALLOCATE teacher_cursor
--     END
-- END

-- EXEC GenerateTeacherUsername;

---- Tu dong insert ClassRoomShift khi thêm phòng học
Go

CREATE PROCEDURE InsertClassRoomWithShifts
	@classroom_code NVARCHAR(32),
	@creator_id INT
AS
BEGIN
	BEGIN TRANSACTION;
	BEGIN TRY
        -- Danh sách các shift code cần được thêm vào ClassRoomShift
        DECLARE @shift_codes TABLE (shift_code VARCHAR(32));
        INSERT INTO @shift_codes
		(shift_code)
	VALUES
		('ca1'),
		('ca2'),
		('ca3'),
		('ca4'),
		('ca5');

        -- Thực hiện chèn vào ClassRoomShift cho từng shift_code
        INSERT INTO ClassRoomShift
		(classroom_code, shift_code, status, creator_id,create_time)
	SELECT @classroom_code, shift_code, 0, @creator_id, getDate()
	FROM @shift_codes;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;

--- Procedure để lấy dữ liệu coursegroup theo giảng viên

Go

CREATE PROCEDURE GetTeacherCourseInfo
	@teacher_id INT
AS
BEGIN
	SELECT
		cg.course_group_id,
		cg.group_code,
		cg.classroomshift_id,
		c.course_name,
		su.avatar_path,
		su.nickname,
		su.avatar_path,
		cls.classroom_code,
		cls.shift_code
	FROM
		CourseGroup cg
		INNER JOIN Course c ON cg.course_code = c.course_code
		INNER JOIN sysUser su ON cg.teacher_id = su.user_id
		INNER JOIN ClassRoomShift cls ON cg.classroomshift_id = cls.classroomshift_id
	WHERE 
        cg.teacher_id = @teacher_id;
END;
GO

-- Example
-- EXEC GetTeacherCourseInfo @teacher_id = 182;

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

-- View tạo để lấy dữ liệu (Nếu chỉ join thì không cần viết store á Duy)
CREATE VIEW vAttendance
AS
	SELECT a.*, ISNULL(b.username, '') AS username, ISNULL(b.nickname, '') AS nickname
	FROM Attendance a
		LEFT JOIN SysUser b ON a.student_id = b.user_id
GO
SELECT * FROM vAttendance
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

--- Store để lấy course group cho sinh viên Update (30/07) | Duy có update ở trên là trả về thêm avatar_path ở GetTeacherCourseInfo
-- 31/07
Go 
CREATE PROCEDURE GetCourseGroupInfoByStudentId
    @student_id INT
AS
BEGIN
    SELECT 
        cg.course_group_id,
        cg.group_code,
        cls.classroom_code,
        su.nickname,
		su.avatar_path,
        c.course_name
    FROM
        CourseGroupStudentList cgsl
    INNER JOIN CourseGroup cg ON cgsl.course_group_id = cg.course_group_id
    INNER JOIN ClassRoomShift cls ON cg.classroomshift_id = cls.classroomshift_id
    INNER JOIN sysUser su ON cg.teacher_id = su.user_id
    INNER JOIN Course c ON cg.course_code = c.course_code
    WHERE 
        cgsl.student_id = @student_id;
END;

-- EXEC GetCourseGroupInfoByStudentId @student_id = 72;

-- 01/08 -- Xem các course group đang hoạt động
Go
CREATE VIEW ActiveCourseGroups AS
SELECT 
    cg.course_group_id,
    cg.course_code,
    cg.group_code,
    c.course_name
FROM 
    CourseGroup cg
INNER JOIN 
    Course c ON cg.course_code = c.course_code
WHERE 
    cg.status = 1;

Go
Select * from ActiveCourseGroups

-- 07/08 View xem tất cả course group
Go
CREATE VIEW CourseGroupInfoView AS
SELECT
    cg.course_group_id,
    cg.group_code,
    cg.classroomshift_id,
	cg.semester_year_id,
	cg.status,
    c.course_name,
    su.avatar_path,
    su.nickname,
    cls.classroom_code,
    cls.shift_code
FROM
    CourseGroup cg
    INNER JOIN Course c ON cg.course_code = c.course_code
    INNER JOIN sysUser su ON cg.teacher_id = su.user_id
    INNER JOIN ClassRoomShift cls ON cg.classroomshift_id = cls.classroomshift_id;
GO

select * from CourseGroupInfoView

-- 08/08
-- View lấy thông tin danh sách sinh viên của lớp học
Go
CREATE VIEW vCourseGroupStudentList
AS
	SELECT a.*, b.username AS student_username, b.nickname AS student_nickname, b.avatar_path AS student_avatar_path
		FROM CourseGroupStudentList a
			JOIN SysUser b ON a.student_id = b.user_id AND b.avatar_path <> '' AND b.status = 1
		WHERE a.status = 1
GO
SELECT * FROM vCourseGroupStudentList WHERE course_group_id = 100

-- chạy lại CourseGroupInfoView nha Phước 08/08