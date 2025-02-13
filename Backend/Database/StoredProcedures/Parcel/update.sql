USE [SENDIT]
GO

CREATE PROCEDURE ProjectCreateOrUpdate
    @id UNIQUEIDENTIFIER,
    @senderEmail VARCHAR(200),
    @senderName VARCHAR(200),
    @receiverName VARCHAR(200),
    @receiverEmail VARCHAR(200),
    @dispatchedDate DATE,
    @deliveryDate DATE,
    @parcelWeight INT,
    @price INT,
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
        senderName     = @senderName,
        receiverName   = @receiverName,
        receiverEmail  = @receiverEmail,
        dispatchedDate = @dispatchedDate,
        deliveryDate   = @deliveryDate,
        parcelWeight   = @parcelWeight,
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
