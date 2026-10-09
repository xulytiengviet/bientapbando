# Kiểm tra bản 1.0

Đã chạy Chromium headless trên bản HTML tại máy, không dựa riêng vào kiểm tra cú pháp.

- Mở giao diện, nạp 34 tỉnh và 3.321 đơn vị: không có lỗi JavaScript.
- Chọn Vĩnh Long, đọc đồng thời ranh tỉnh z6 và ranh xã z7–9.
- VN-2000 TM-3 kinh tuyến 105.75°: tọa độ WGS84 (105.97, 10.25)
  chuyển thành E=523904.518, N=1133514.175 m; chuyển ngược về tọa độ
  gốc với sai số số học dưới 1e-8 độ. Đây là kiểm tra roundtrip, không
  phải kiểm định độ chính xác trắc địa độc lập.
- Lưu/mở dự án chứa GeoJSON và nhãn kéo thả: phục hồi đủ lớp và thiết lập.
- Xuất PNG 300 DPI: 2480 × 3508 pixel.
- PDF dọc: 1 trang, 595.28 × 841.89 pt (A4).
- PDF ngang: 1 trang, 841.89 × 595.28 pt (A4).
- Kiểm tra bằng ảnh xuất: ranh giới, nhãn, lưới, hướng Bắc, bản đồ vị trí,
  chú giải, thước tỷ lệ, tên tác giả và nguồn dữ liệu xuất hiện.
- Viewport điện thoại 390 px: không tràn chiều ngang của tài liệu.

Dịch vụ vệ tinh/OSM/Google/XYZ phụ thuộc mạng và CORS của nhà cung cấp;
khả năng tải tại từng mạng người dùng không được bảo đảm bởi kiểm thử offline.
