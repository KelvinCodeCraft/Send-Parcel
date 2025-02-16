USE [SENDIT]
GO

-- Now create the stored procedure for inserting a new parcel.
CREATE PROCEDURE createParcel (
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
)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.PARCEL (
        senderEmail,
        senderNumber,
        receiverNumber,
        receiverEmail,
        dispatchedDate,
        price,
        receiverLat,
        receiverLng,
        senderLat,
        senderLng, 
        deliveryStatus
    )
    VALUES (
        @senderEmail,
        @senderNumber,
        @receiverNumber,
        @receiverEmail,
        @dispatchedDate,
        @price,
        @receiverLat,
        @receiverLng,
        @senderLat,
        @senderLng,
        @deliveryStatus
    );

    SELECT SCOPE_IDENTITY() AS id;
END;
GO
