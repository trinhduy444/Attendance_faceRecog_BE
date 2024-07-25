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
    @classroom_code NVARCHAR(32)
AS
BEGIN
    BEGIN TRANSACTION;
    BEGIN TRY
        -- Danh sách các shift code cần được thêm vào ClassRoomShift
        DECLARE @shift_codes TABLE (shift_code NVARCHAR(10));
        INSERT INTO @shift_codes (shift_code) VALUES
            ('ca1'), ('ca2'), ('ca3'), ('ca4'), ('ca5');

        -- Thực hiện chèn vào ClassRoomShift cho từng shift_code
        INSERT INTO ClassRoomShift (classroom_code, shift_code, status)
        SELECT @classroom_code, shift_code, 0
        FROM @shift_codes;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
