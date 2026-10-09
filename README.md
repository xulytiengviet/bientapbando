# Biên tập bản đồ A4

Trình biên tập bản đồ HTML tĩnh do **Long Ngo** phát triển · MIT 2026.

## Sử dụng

Mở `index.html` (giữ thư mục `vendor`, `app.js`, `style.css` cùng cấp),
hoặc dùng tệp độc lập `bien-tap-ban-do.htm`.
GitHub Pages: https://xulytiengviet.github.io/bientapbando/

1. Chọn tỉnh / thành hoặc tìm xã, phường, đặc khu.
2. Chọn nền trắng, OpenStreetMap, vệ tinh Esri, các nền Google legacy theo
   adapter Vietflex hoặc URL XYZ riêng có hỗ trợ CORS.
3. Bật ranh tỉnh / xã, chỉnh màu, độ đậm và nhãn.
4. Nhập GeoJSON cho biên giới, địa hình, sông, đường hoặc vùng chuyên đề;
   có thể thêm PNG/JPG đã nắn chỉnh bằng phạm vi tây/đông/nam/bắc WGS84.
5. Vẽ điểm, đường, vùng; đặt nhãn kéo thả; đổi tên/màu và bật tắt từng lớp.
6. Chọn A4 dọc/ngang, chỉnh tiêu đề, tác giả, ghi chú, chú giải; kéo dấu ⠿
   để di chuyển chú giải, bản đồ vị trí, hướng Bắc.
7. Xuất PNG hoặc PDF A4 ở 150/300 DPI. Nút Lưu dự án lưu toàn bộ thiết lập,
   hình vẽ và ảnh nhúng vào JSON để mở lại.

Lớp vector tự thêm có thể xuất GeoJSON WGS84. Ranh giới nền PMTiles và ảnh
không được đưa vào GeoJSON xuất; chúng vẫn có trong PNG/PDF.

## Dữ liệu và bản đồ tham khảo

- Kế thừa bộ dữ liệu nhúng từ Vietflexmap/anhmap tại commit
  `e80f4ee9f1e167817e4a9af8402c0bca4052573e`.
- Danh mục 34 tỉnh / thành và 3.321 đơn vị cấp xã; ranh giới PMTiles có mức
  chi tiết gốc z4–z9. Phóng lớn hơn chỉ nội suy, không tăng độ chính xác.
- Khung mặc định bao gồm đất liền và Biển Đông; nhãn Hoàng Sa/Trường Sa là
  nhãn địa danh tham khảo, không tạo ra đường biên hoặc yêu sách biển mới.
- Mẫu Thayetchaung được dùng để tham khảo bố cục (khung lưới, chú giải,
  bản đồ vị trí, hướng Bắc, tỷ lệ). Không tự tạo lớp nguy cơ sạt lở từ mẫu.
  Nút bảng màu nguy cơ chỉ thiết lập chú giải; cần nạp dữ liệu chuyên đề thật.
- Có lớp biên giới quốc gia tổng quát Natural Earth 1:110m (public domain)
  cho bối cảnh khu vực. Có thể thay bằng GeoJSON chi tiết do người dùng cung cấp.
  Các đường ranh này không phải dữ liệu pháp lý được xác nhận.

## WGS84 / VN-2000

WGS84 là EPSG:4326, đơn vị độ. VN-2000 có TM-3 tùy chỉnh kinh tuyến trục
(k0=0.9999), UTM 48N (105°, k0=0.9996), UTM 49N (111°, k0=0.9996).
Tọa độ dùng thứ tự **E,N** (easting,northing). Kinh tuyến trục TM-3 mặc định
105.75° chỉ là giá trị khởi tạo; người dùng cần chọn theo hồ sơ địa phương.

Proj4 dùng chuyển datum VN-2000/WGS84 từ EPSG operation 6960 như xuất PROJ
của https://epsg.io/4756, bao gồm 7 tham số thay vì chỉ đổi nhãn tọa độ.
Lưới VN-2000 được tạo từ các đường E/N rồi chiếu ngược lên bản đồ.
**Nền ảnh vẫn là Web Mercator**; chọn VN-2000 chuyển tọa độ/lưới và chuyển
GeoJSON nhập, không tái chiếu toàn bộ ảnh nền thành bản đồ đo đạc TM-3.
Không dùng thay quy trình đo đạc địa chính hoặc chuyển hệ được kiểm định.

## Xuất bản đồ

PDF là ảnh raster A4, không phải GeoPDF hoặc PDF vector. 300 DPI xấp xỉ
2480 × 3508 px (dọc). Thước tỷ lệ gần đúng tại tâm bản đồ do nền Mercator.
Ảnh nền cần mạng, CORS và tuân thủ điều khoản nhà cung cấp. Khi tải tile lỗi,
ứng dụng chặn xuất để tránh âm thầm mất nền; chọn nền trắng để xuất offline.
Lần đầu mở tệp độc lập có thể mất vài giây giải mã dữ liệu nhúng.

## Kiến trúc

HTML/CSS/JS tĩnh, không backend, không API trả phí bắt buộc. Leaflet 1.9.4
được giữ để tương thích bộ vẽ PMTiles của ẢnhMap. URL nền legacy Google
kế thừa cơ chế snippet Vietflex do người dùng cung cấp; không nạp đồng thời
Vietflex/Leaflet 2 và Leaflet 1 vì API lớp không tương thích.
Proj4js, html2canvas và jsPDF được đóng gói tại `vendor/` để không phụ thuộc
CDN khi dùng nền trắng. Ghi nguồn xuất bản luôn được giữ.

## Chạy và triển khai

```sh
python3 -m http.server 8080
```

Mở http://localhost:8080. Với GitHub Pages, dùng branch `main`, thư mục `/`.
Mã nguồn có MIT; dữ liệu và dịch vụ bên thứ ba giữ giấy phép riêng, xem
THIRD_PARTY_NOTICES.md. Không cần gửi dữ liệu người dùng lên máy chủ.
