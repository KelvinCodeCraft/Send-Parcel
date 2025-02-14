USE [SENDIT]
GO

ALTER PROCEDURE getParcelsByEmail
    @email VARCHAR(200),
    @role VARCHAR(10) -- 'sender' or 'receiver'
AS
BEGIN
    SET NOCOUNT ON;

    IF @role = 'sender'
    BEGIN
        SELECT 
            id,
            senderEmail,
            senderName,
            receiverName,
            receiverEmail,
            dispatchedDate,
            deliveryDate,
            parcelWeight,
            price,
            receiverLat,
            receiverLng,
            senderLat,
            senderLng,
            deliveryStatus
        FROM dbo.PARCEL
        WHERE senderEmail = @email;
    END
    ELSE IF @role = 'receiver'
    BEGIN
        SELECT 
            id,
            senderEmail,
            senderName,
            receiverName,
            receiverEmail,
            dispatchedDate,
            deliveryDate,
            parcelWeight,
            price,
            receiverLat,
            receiverLng,
            senderLat,
            senderLng,
            deliveryStatus
        FROM dbo.PARCEL
        WHERE receiverEmail = @email;
    END
    ELSE
    BEGIN
        -- If no role is specified, return all parcels related to the email
        SELECT 
            id,
            senderEmail,
            senderName,
            receiverName,
            receiverEmail,
            dispatchedDate,
            deliveryDate,
            parcelWeight,
            price,
            receiverLat,
            receiverLng,
            senderLat,
            senderLng,
            deliveryStatus
        FROM dbo.PARCEL
        WHERE senderEmail = @email OR receiverEmail = @email;
    END
END;