# 🇻🇳 vi-obsidian — Neo4j Graph View cho Obsidian

> Bản Việt hóa và tài liệu hóa lại **Neo4j Graph View**, plugin giúp biến kho ghi chú Obsidian thành một đồ thị có thể trực quan hóa và truy vấn bằng Neo4j/Cypher.

![Neo4j Graph View](https://raw.githubusercontent.com/HEmile/obsidian-neo4j-graph-view/main/neo4j-graph-view/resources/styled_screenshot.png)

> [!IMPORTANT]
> Dự án gốc **Neo4j Graph View đã ngừng phát triển** và được tác giả thay thế bằng Juggl. Kho mã nguồn này phù hợp cho nghiên cứu, học tập, bảo trì hệ thống cũ và phát triển bản fork/Việt hóa.

## 📌 Tổng quan

`vi-obsidian` kết nối Obsidian với Neo4j để biểu diễn ghi chú dưới dạng **node** và liên kết giữa ghi chú dưới dạng **edge**. So với Graph View mặc định, kiến trúc này cho phép mô hình hóa dữ liệu có ngữ nghĩa rõ hơn và truy vấn bằng ngôn ngữ Cypher.

Các khả năng chính:

- 🕸️ trực quan hóa mạng lưới ghi chú bằng Neo4j/Neovis;
- 🎨 tùy biến node và edge theo tag, thư mục và loại liên kết;
- 🔎 chạy truy vấn Cypher từ Obsidian;
- 🔗 hỗ trợ liên kết có kiểu (typed links);
- 🌳 bố cục phân cấp;
- 🖼️ hiển thị hình ảnh trên đồ thị;
- 🔄 đồng bộ thay đổi từ Markdown sang Neo4j;
- 🧭 mở, mở rộng, ẩn và chọn node trực tiếp trên Graph View.

## 🧠 Kiến trúc

Dự án gồm hai phần chính.

### 1. Plugin Obsidian bằng TypeScript

Thư mục `neo4j-graph-view/` chứa mã giao diện và tương tác với Obsidian:

```text
neo4j-graph-view/
├── main.ts            # vòng đời plugin, command, tiến trình Python
├── settings.ts        # cấu hình plugin
├── visualization.ts   # hiển thị và tương tác đồ thị
├── styles.css         # CSS
├── package.json       # dependency và script build
└── rollup.config.js   # cấu hình bundler
```

Lớp này sử dụng `neovis.js`/`vis-network` để hiển thị đồ thị và gọi tiến trình Python để đồng bộ dữ liệu.

### 2. Semantic Markdown Converter bằng Python

Thư mục `smdc/` đọc các tệp Markdown trong vault, phân tích metadata và chuyển chúng thành dữ liệu Neo4j.

Quy tắc ánh xạ tổng quát:

| Markdown / Obsidian | Neo4j |
|---|---|
| tên ghi chú | thuộc tính `name` |
| nội dung ghi chú | thuộc tính `content` |
| YAML frontmatter | thuộc tính của node |
| tag | nhãn/kiểu thực thể |
| wikilink | quan hệ `inline` |
| typed link | quan hệ có kiểu tương ứng |
| liên kết tới ghi chú chưa tồn tại | dangling node |

Nhờ đó, một vault Obsidian có thể được sử dụng như một **knowledge graph** cá nhân.

## ⚙️ Yêu cầu

Plugin chạy trên máy tính để bàn và cần:

1. Obsidian Desktop;
2. Python 3.6+ có trong `PATH`;
3. Neo4j Desktop;
4. một database Neo4j đang chạy;
5. mật khẩu Neo4j.

> [!WARNING]
> Phiên bản plugin này lưu mật khẩu Neo4j trong dữ liệu cấu hình của vault dưới dạng plaintext. Không dùng mật khẩu quan trọng hoặc mật khẩu dùng chung với dịch vụ khác.

## 🚀 Cài đặt

1. Cài Python 3.6 trở lên và kiểm tra `python3`/`pip3` hoạt động.
2. Cài Neo4j Desktop.
3. Tạo database mới, đặt mật khẩu và khởi động database.
4. Cài plugin vào vault Obsidian và bật trong **Settings → Community plugins**.
5. Mở phần cài đặt **Neo4j Graph View**, nhập mật khẩu Neo4j.
6. Chạy lệnh khởi động lại Neo4j stream từ Command Palette.

## 🧭 Sử dụng Graph View

Mở một ghi chú, nhấn `Ctrl/Cmd + P`, sau đó chạy:

```text
Neo4j Graph View: Open local graph of note
```

Các thao tác chính:

- **nhấp node**: mở ghi chú;
- **nhấp đúp node**: mở rộng node lân cận;
- **Shift + kéo chuột**: chọn nhiều node;
- **E**: mở rộng vùng chọn;
- **H** hoặc **Backspace**: ẩn vùng chọn;
- **I**: đảo vùng chọn;
- **A**: chọn tất cả.

## 🔎 Truy vấn Cypher

Tạo code block `cypher` trong ghi chú:

```cypher
MATCH (n)-[r]-(m)
RETURN n, r, m
LIMIT 50
```

Đặt con trỏ trong code block rồi chạy:

```text
Neo4j Graph View: Execute Cypher query
```

Plugin sẽ mở một Graph View mới để hiển thị kết quả.

## 🔗 Typed Links — liên kết có kiểu

Ngoài wikilink thông thường, plugin hỗ trợ cú pháp:

```markdown
- supports [[Dự án A]], [[Dự án B|Bí danh]]
- depends_on [[Dịch vụ dữ liệu]]
```

`supports` và `depends_on` trở thành kiểu quan hệ trong Neo4j. Cách biểu diễn này hữu ích khi cần mô tả ngữ nghĩa giữa các ghi chú, thay vì chỉ ghi nhận rằng hai ghi chú có liên kết.

## 🎨 Tùy biến node và edge

Kiểu hiển thị được cấu hình bằng JSON trong Settings. Ví dụ:

```json
{
  "defaultStyle": {
    "size": 9,
    "borderWidth": 0
  },
  "image": {
    "size": 40
  }
}
```

Có thể khai báo style riêng theo tag, thư mục và loại quan hệ.

## 🧪 Công cụ Neo4j bổ trợ

Dữ liệu do plugin tạo có thể tiếp tục được khám phá bằng:

- **Neo4j Bloom** — khám phá dữ liệu đồ thị trực quan;
- **Neo4j Browser** — chạy truy vấn Cypher nâng cao;
- **GraphXR** — trực quan hóa đồ thị 3D.

## 🛠️ Phát triển

Cài dependency và build plugin:

```bash
cd neo4j-graph-view
npm install
npm run build
```

Phần Python nằm trong `smdc/` và được đóng gói từ `setup.py`.

## ⚠️ Trạng thái và tương thích

Mã nguồn này thuộc thế hệ plugin cũ. Một số API Obsidian, dependency TypeScript/Python hoặc cách Neo4j hoạt động có thể đã thay đổi so với thời điểm dự án gốc được phát triển. Khi triển khai thực tế, nên kiểm thử trên một vault sao lưu trước.

## 🙏 Ghi nhận nguồn

Dự án kế thừa mã nguồn của **Emile van Krieken (HEmile)** và dự án **Neo4j Graph View / semantic-markdown-converter**. Dự án kế nhiệm chính thức của tác giả gốc là **Juggl**.

Bản Việt hóa giữ nguyên các thuật ngữ kỹ thuật quan trọng như `Neo4j`, `Cypher`, `Obsidian`, `vault`, `node`, `edge`, `JSON` và tên khóa cấu hình để thuận tiện đối chiếu tài liệu kỹ thuật.

## 📄 Giấy phép

Xem tệp [`LICENSE`](LICENSE) để biết điều khoản cấp phép của kho mã nguồn.
