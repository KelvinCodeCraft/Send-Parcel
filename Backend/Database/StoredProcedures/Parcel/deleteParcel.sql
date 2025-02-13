USE [SENDIT]
GO

CREATE PROCEDURE deleteParcel
    @id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    
    IF NOT EXISTS (SELECT 1 FROM dbo.PARCEL WHERE id = @id)
    BEGIN
        PRINT 'Parcel not found';
        RETURN;
    END

    DELETE FROM dbo.PARCEL WHERE id = @id;
    
    PRINT 'Parcel deleted successfully';
END;
