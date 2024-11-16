from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

def send_html_email(sender_email, app_password, recipient_email, verification_key,website_name):
    try:
        # Set up the SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Start TLS for security

        # Log in to your email account using the App Password
        server.login(sender_email, app_password)

        # Create a multipart email message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = recipient_email
        msg['Subject'] = "Password Reset Verification"

        # Define HTML content with the verification key
        html_content = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 20px;
                }}
                .container {{
                    max-width: 600px;
                    margin: auto;
                    background: white;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }}
                h1 {{
                    color: #333;
                }}
                p {{
                    color: #555;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #777;
                }}
                .button {{
                    display: inline-block;
                    background-color: #ee6654;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    margin-top: 20px;
                }}
                .website-name {{
                    font-weight: bold;
                    color: #333;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Password Reset Request</h1>
                <p>Hello,</p>
                <p>You have requested to reset your password on <span class="website-name">{website_name}</span>. Please click the button below to verify your email and reset your password:</p>
                <a href="https://your-website.com/reset_password?key={verification_key}" class="button">Reset Password</a>
                <p>If you did not request this, you can safely ignore this email.</p>
                <div class="footer">This email was sent with ❤️ using Python.</div>
            </div>
        </body>
        </html>
        """


        # Attach the HTML content to the email
        msg.attach(MIMEText(html_content, 'html'))

        # Send the email
        server.sendmail(sender_email, recipient_email, msg.as_string())

        print('Password reset email sent successfully!')

    except Exception as e:
        print(f'Error: {e}')

    finally:
        server.quit()

# Example usage
if __name__ == "__main__":
    sender_email = 'hariharans.cloud@gmail.com'  # Your email
    app_password = 'ofzc apjz zqmg yiwe'       # Your App Password
    recipient_email = 'skaviyapriya1605@gmail.com'  # Recipient's email
    subject = 'Hello World'                   # Email subject
    body = 'verificationkey'  # Email body
    website_name="wordpress-host"
    
    send_html_email(sender_email, app_password, recipient_email, body,website_name)

