ALTER PROCEDURE TableLoadingPagination
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
	SELECT @Offset = (@PageNumber - 1) * @RowPerPage, @Key = @Search
	IF @Key = '' SET @Key = '(1=1)'

	SET @q = '
		select a.*
			from (select top @@RowPerPage a.* @@OtherFields from @@table a) a
				@@OtherJoins
			where @@Search
		order by @@Order
	'
	SET @q = REPLACE(@q, '@@table', @Table)
	SET @q = REPLACE(REPLACE(@q, '@@OtherJoins', @OtherJoins), '@@OtherFields', @OtherFields)
	SET @q = REPLACE(REPLACE(@q, '@@Order', @Order), '@@Searcg', @Search)
	SET @q = REPLACE(REPLACE(@q, '@@RowPerPage', RTRIM(@RowPerPage)), '@@Offset', RTRIM(@Offset))
	PRINT(@q)
END
GO

EXEC TableLoadingPagination 'Sysuser'