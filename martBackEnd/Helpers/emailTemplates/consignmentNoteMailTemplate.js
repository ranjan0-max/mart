exports.ConsignmentNoteMailTemplate = (ConsignmentData) => `
 <!DOCTYPE html>
<html>

<head>
    <style>
        /* Add styling to match your brand and preferences */
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #2878b6;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 10px;
            background-color: #fff;
            border: 2px solid #2878b6;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            text-align: center;
        }
        .header {
            background-color: #2878b6;
            color: #fff;
            padding: 20px;
        }
        .header h1 {
            margin: 0;
            padding: 0;
            font-size: 24px;
        }
        .header .origin {
            float: left;
        }
        .header .destination {
            float: right;
        }
        .content {
            padding: 10px;
            color: #333;
        }
        .message {
            margin-top: 20px;
            padding: 10px;
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            color: #333;
        }
        .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #999;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>CONSIGNMENT NOTE</h1>
            <div class="origin">Origin: ${ConsignmentData.origin}</div>
            <div class="destination">Destination:  ${ConsignmentData.destination}</div>
        </div>
        <div class="message">
            <p><strong>Shipment Reference No:</strong> ${ConsignmentData.bookingNumber}</p>
            <p><strong>Shipment CR No:</strong> ${ConsignmentData.awbNumber}</p>
            
            <p><strong>Shipment Status:</strong> ${ConsignmentData.status}</p>
            <p><strong>Shipment Mode:</strong> ${ConsignmentData.mode}</p>
            <p><strong>Shipment Created Date</strong> ${ConsignmentData.created_at}</p>
        <p style="color: #2878b6;">
          Your shipment has been successfully booked with Three Line Shipping and please find the attached document. We appreciate your business!
        </p>
        </div>
      <div class="footer">
        <p style="color: #2878b6;">
          We are looking forward to processing your shipment. If you have any questions or need to make any changes, please feel free to contact us.
        </p>
        </div>

    </div>
</body>

</html>
`;
