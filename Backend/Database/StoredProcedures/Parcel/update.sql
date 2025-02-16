USE [SENDIT]
GO

CREATE PROCEDURE ProjectCreateOrUpdate
    @id UNIQUEIDENTIFIER,
    @senderEmail VARCHAR(200),
    @senderNumber VARCHAR(200),
    @receiverNumber VARCHAR(200),
    @receiverEmail VARCHAR(200),
    @dispatchedDate DATE,
    @price FLOAT,
    @receiverLat VARCHAR(200),
    @receiverLng VARCHAR(200),
    @senderLat VARCHAR(200),
    @senderLng VARCHAR(200),
    @deliveryStatus VARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE dbo.PARCEL
    SET 
        senderEmail    = @senderEmail,
        senderNumber     = @senderNumber,
        receiverNumber   = @receiverNumber,
        receiverEmail  = @receiverEmail,
        dispatchedDate = @dispatchedDate,
        price          = @price,
        receiverLat    = @receiverLat,
        receiverLng    = @receiverLng,
        senderLat      = @senderLat,
        senderLng      = @senderLng,
        deliveryStatus         = @deliveryStatus
    WHERE id = @id;

    SELECT * FROM dbo.PARCEL WHERE id = @id;
END;
GO


