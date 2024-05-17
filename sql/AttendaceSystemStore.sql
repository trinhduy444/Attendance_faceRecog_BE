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