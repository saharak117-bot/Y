MyTube - เว็บเล่นวิดีโอ YouTube + Google Sign-In (Starter Project)

สิ่งที่ทำได้
- วางลิงก์ YouTube หรือ Shorts แล้วเล่นผ่าน YouTube Embedded Player
- เข้าสู่ระบบ Google ผ่าน Google Identity Services
- บันทึก/ลบคลิปโปรดไว้ใน localStorage ของเบราว์เซอร์เครื่องนั้น
- ใช้งานได้ทั้งมือถือ Android และคอมพิวเตอร์ผ่านเว็บเบราว์เซอร์

ข้อจำกัดสำคัญ
- ไม่ได้บล็อกหรือข้ามโฆษณา YouTube และไม่รับประกันว่าไม่มีโฆษณา
- การเข้าสู่ระบบในชุดเริ่มต้นนี้ใช้เพื่อแสดงตัวตนบนหน้าเว็บเท่านั้น ไม่ได้มี backend ตรวจสอบ token หรือระบบบัญชีที่ปลอดภัยสำหรับ production
- รายการโปรดเก็บในอุปกรณ์/เบราว์เซอร์ปัจจุบัน ไม่ได้ซิงก์ข้ามเครื่อง

ตั้งค่า Google Login
1. เข้า Google Cloud Console และสร้าง Project
2. ตั้งค่า OAuth consent screen / Branding ตามขั้นตอนของ Google
3. สร้าง OAuth Client ID ประเภท Web application
4. เพิ่ม Authorized JavaScript origins เช่น http://localhost:8000 และโดเมนจริงของเว็บ
5. เปิด index.html แล้วแทน YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com ด้วย Client ID ที่ได้
6. ห้ามนำ Client Secret ไปใส่ในไฟล์หน้าเว็บ

วิธีเปิดทดสอบ
- แตกไฟล์ ZIP
- เปิด Terminal/Command Prompt ในโฟลเดอร์โปรเจกต์
- รัน: python -m http.server 8000
- เปิด http://localhost:8000
- สำหรับ Google Login ต้องตั้งค่า Authorized JavaScript origins ให้ตรงกับ origin ที่ใช้

หมายเหตุ: การเล่นวิดีโอใช้ YouTube IFrame Player/Embed ตามข้อกำหนดของ YouTube
เอกสาร: https://developers.google.com/youtube/iframe_api_reference
เอกสาร Embed: https://support.google.com/youtube/answer/171780
เอกสาร Google Identity: https://developers.google.com/identity/gsi/web
