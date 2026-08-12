## 🇻🇳 Neo4j Graph View

![Neo4j Graph View](resources/obsidian%20neo4j%20plugin.gif)

Neo4j Graph View bổ sung một chế độ xem đồ thị nâng cao cho Obsidian bằng cách kết nối vault với cơ sở dữ liệu [Neo4j](https://neo4j.com/).

### ✨ Tính năng

- Tô màu node theo tag hoặc nhóm dữ liệu.
- Mở rộng và ẩn node có chọn lọc.
- Hỗ trợ liên kết có kiểu với cú pháp `- linkType [[ghi chú 1]], [[ghi chú 2|bí danh]]`.
- Hỗ trợ bố cục phân cấp.
- Đồng bộ dữ liệu Markdown sang Neo4j.
- Mở ghi chú trực tiếp từ node trên đồ thị.

### ⚙️ Cài đặt

1. Cài Python 3.6 trở lên và đảm bảo Python có trong `PATH`.
2. Cài [Neo4j Desktop](https://neo4j.com/download/).
3. Tạo một database mới trong Neo4j Desktop và khởi động database.
4. Ghi nhớ mật khẩu của database.
5. Trong phần cài đặt plugin, nhập mật khẩu Neo4j rồi chạy lệnh khởi động lại Neo4j stream.

> [!WARNING]
> Plugin lưu mật khẩu Neo4j trong cấu hình vault dưới dạng plaintext. Không sử dụng mật khẩu quan trọng hoặc mật khẩu dùng chung với dịch vụ khác.

### 🧭 Sử dụng

Khi đang mở một ghi chú, chạy lệnh:

`Neo4j Graph View: Open local graph of note`

Các thao tác chính:

- Nhấp một node để mở ghi chú tương ứng.
- Nhấp đúp node để mở rộng các node lân cận.
- Shift + kéo chuột để chọn nhiều node.
  - `E`: mở rộng vùng lân cận của các node đã chọn.
  - `H` hoặc `Backspace`: ẩn các node đã chọn.
  - `I`: đảo vùng chọn.
  - `A`: chọn tất cả node.
- Các ghi chú được mở có thể được tự động thêm vào đồ thị tùy theo cấu hình.

### 🔗 Ngữ nghĩa dữ liệu

Plugin đọc các tệp `.md` trong vault và diễn giải chúng theo các quy tắc chính:

- tag → kiểu/nhãn thực thể;
- YAML frontmatter → thuộc tính thực thể;
- wikilink → quan hệ `inline`;
- dòng dạng `- linkType [[ghi chú 1]], [[ghi chú 2|bí danh]]` → quan hệ có kiểu `linkType`;
- tên ghi chú → thuộc tính `name`;
- nội dung ghi chú → thuộc tính `content`;
- liên kết đến ghi chú chưa tồn tại → node tạm (dangling node).

Cú pháp typed link của dự án là một quy ước riêng để bổ sung ngữ nghĩa cho quan hệ giữa các ghi chú.

### ⚠️ Trạng thái dự án

Neo4j Graph View là dự án cũ và đã được tác giả gốc thay thế bằng Juggl. Bản này phù hợp cho nghiên cứu, học tập, bảo trì và phát triển fork; nên kiểm thử kỹ trước khi sử dụng với vault quan trọng.
