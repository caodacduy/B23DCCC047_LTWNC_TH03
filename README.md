# Thư viện khoa CNTT PTIT · TH03

Ứng dụng Next.js App Router để tra cứu và đăng ký mượn sách tại thư viện khoa CNTT.

## Chạy cục bộ

Yêu cầu Node.js 22.12 trở lên.

```sh
npm ci
```

Trước khi chạy, tạo `.env.local` chứa một giá trị `AUTH_SECRET` ngẫu nhiên. Có thể tạo file từ thư mục dự án bằng lệnh dưới đây (chỉ chạy khi chưa có file):

```sh
node -e "require('fs').writeFileSync('.env.local', 'AUTH_SECRET='+require('crypto').randomBytes(32).toString('base64')+'\n', {flag:'wx'})"
```

Sau đó chạy:

```sh
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Tài khoản thực hành

- Sinh viên: `sv01@ptit.edu.vn` hoặc `sv02@ptit.edu.vn`, mật khẩu `sv123456`.
- Thủ thư: `admin@ptit.edu.vn`, mật khẩu `admin123`.

Dữ liệu mẫu gồm 24 đầu sách và 37 yêu cầu. Thay đổi chỉ lưu trong bộ nhớ của một tiến trình Next.js, nên khởi động lại server sẽ khôi phục dữ liệu mẫu. Mật khẩu trong đề chỉ dành cho bài thực hành; không dùng các tài khoản mẫu cho website thật.

## Kiểm thử và bản production

```sh
npm test
npm run coverage
npm run build
npm start
```

- Bộ kiểm thử gồm 35 ca. Báo cáo [coverage](./coverage.png) cho thấy 100% số dòng được chạy ở bốn tệp yêu cầu; lệnh coverage tự kiểm tra ngưỡng 70% cho từng tệp.
- Trang chủ được sinh sẵn. Danh mục được render theo `q` và `category` ở mỗi request. Chi tiết sách sinh sẵn 12 trang, sinh theo yêu cầu cho phần còn lại và cập nhật sau mỗi 60 giây khi có lượt truy cập.
- Danh mục có ranh giới tải riêng để trang chi tiết sách không tồn tại trả HTTP 404.
- `/loans` lọc theo `status`, chia trang theo `page` và chọn sẵn sách với `book`. Đăng nhập với tư cách sinh viên để gửi hoặc hủy yêu cầu chờ duyệt. Đăng nhập với tư cách thủ thư để duyệt hoặc từ chối ở `/admin`.
- Kiểm tra tồn kho: sách 6 đã hết bản vào ngày 02/12/2026; sách 11 có thể mượn ngày 03/12/2026 với dữ liệu mẫu. Hai ví dụ này cần chạy trước ngày tương ứng.

Tham khảo [cách Next.js sinh trang tĩnh theo từng đường dẫn](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) và [cơ chế ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration).

## Nộp bài

Dùng Git repository riêng trong thư mục này. Khi nộp, tạo repo GitHub public với tên `<Mã sinh viên>_LTWNC_TH03` và đẩy bốn commit `Phan 1` đến `Phan 4`. Giữ `.env.local` trên máy cá nhân; repo đã có `.env.example`.
