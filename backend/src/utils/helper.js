import crypto from 'crypto';

export const generateRandomString = (length = 10) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for(let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  export const generateOTP = () => {
    try {
      const otp = crypto.randomInt(100000, 999999).toString();
      return otp;
    } catch (error) {
      throw new Error("Failed to generate OTP.");
    }
  }

  export const otpEmailTemplateFirst = `</span>
      </div>
      <p style="font-size:14px; line-height:1.6; color:#bbbbbb;">
        This OTP will expire in 5 minutes. If you did not request this, please ignore this email.
      </p>
      <p style="font-size:14px; line-height:1.6;">— The <span style="color:#00ff88;">CodeByMidApps</span> Team</p>
    </div>`

    export const otpEmailTemplateLast = `</span>
      </div>
      <p style="font-size:14px; line-height:1.6; color:#bbbbbb;">
        This OTP will expire in 5 minutes. If you did not request this, please ignore this email.
      </p>
      <p style="font-size:14px; line-height:1.6;">— The <span style="color:#00ff88;">CodeByMidApps</span> Team</p>
    </div>`

export const accountCreatedEmailTemplateFirst = `
        <div style="background-color:#0f0f0f; color:#e0e0e0; padding:40px; font-family:Arial, sans-serif; border-radius:10px; max-width:600px; margin:auto;">
          <h2 style="color:#00ff88; text-align:center;">CodeByMidApps</h2>
          <h3 style="text-align:center; color:#ffffff;">Your <span style="color:#00ff88;">Talkzy</span> account is ready 🎉</h3>
          <p style="font-size:16px; line-height:1.6;">Hi <strong>`

      export const accountCreatedEmailTemplateLast = `
      </strong>,</p>
          <p style="font-size:16px; line-height:1.6;">
            You’ve successfully created your Talkzy account. Welcome to the place where conversations spark, ideas flow, and connections grow!
          </p>
          <p style="font-size:16px; line-height:1.6;">
            Start chatting, sharing, and building your community.
          </p>
          <div style="text-align:center; margin:30px 0;">
            <a href="https://your-talkzy-app-url.com/login" style="background-color:#00ff88; color:#000; padding:12px 30px; text-decoration:none; font-size:16px; font-weight:bold; border-radius:6px;">
              Launch Talkzy 🚀
            </a>
          </div>
          <p style="font-size:14px; color:#bbbbbb;">
            If you didn’t create this account, you can safely ignore this email.
          </p>
          <p style="font-size:14px; line-height:1.6;">— The <span style="color:#00ff88;">CodeByMidApps</span> Team</p>
        </div>
      `