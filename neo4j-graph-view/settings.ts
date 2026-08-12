import {App, Notice, PluginSettingTab, Setting, SplitDirection} from "obsidian";

import Neo4jViewPlugin from './main';
import {EdgeOptions, NodeOptions} from "vis-network";
import {NeoVisView, NV_VIEW_TYPE} from "./visualization";

export interface INeo4jViewSettings {
    index_content: boolean;
    auto_expand: boolean;
    auto_add_nodes: boolean;
    community: string;
    hierarchical: boolean;
    convert_markdown: boolean;
    show_arrows: boolean;
    inlineContext: boolean;
    password: string;
    typed_link_prefix: string;
    splitDirection: SplitDirection; // 'horizontal';
    imgServerPort: number;
    debug: boolean;
    nodeSettings: string;
    edgeSettings: string;
}

export const DefaultNodeSettings: NodeOptions = {
    size: 9,
    font: {
        size: 12,
        strokeWidth: 1
    },
    borderWidth: 0,
    widthConstraint: {maximum: 200},
}

export const DefaultEdgeSettings: EdgeOptions = {
    font: {
        size: 12,
        strokeWidth: 2
    },
    width: 0.5,
}

export const DefaultNeo4jViewSettings: INeo4jViewSettings = {
    auto_add_nodes: true,
    auto_expand: false,
    hierarchical: false,
    index_content: false,
    convert_markdown: true,
    community: "tags",
    password: "",
    show_arrows: true,
    inlineContext: false,
    splitDirection: 'horizontal',
    typed_link_prefix: '-',
    imgServerPort: 3837,
    debug: false,
    nodeSettings: JSON.stringify({
        "defaultStyle": DefaultNodeSettings,
        "exampleTag": {
            size: 20,
            color: "yellow"
        },
        "image": {
            size: 40,
            font: {
                size: 0
            }
        },
    }),
    edgeSettings: JSON.stringify({
        "defaultStyle": DefaultEdgeSettings,
    })
}



export class Neo4jViewSettingTab extends PluginSettingTab {
    plugin: Neo4jViewPlugin;
    constructor(app: App, plugin: Neo4jViewPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let {containerEl} = this;
        containerEl.empty();

        containerEl.createEl('h3');
        containerEl.createEl('h3', {text: 'Neo4j Graph View'});

        let doc_link = document.createElement("a");
        doc_link.href = "https://juggl.io/Neo4j+Graph+View/Neo4j+Graph+View+Plugin";
        doc_link.target = '_blank';
        doc_link.innerHTML = 'tài liệu hướng dẫn';

        let discord_link = document.createElement("a");
        discord_link.href = "https://discord.gg/sAmSGpaPgM";
        discord_link.target = '_blank';
        discord_link.innerHTML = 'máy chủ Discord';

        let juggl_link = document.createElement("a");
        juggl_link.href = "https://juggl.io/";
        juggl_link.target = '_blank';
        juggl_link.innerHTML = 'Juggl';

        let introPar = document.createElement("p");
        introPar.innerHTML = "CẢNH BÁO: Neo4j Graph View đã ngừng phát triển và sẽ không nhận thêm bản cập nhật. " +
            "Plugin này có thể bị gỡ khỏi danh sách plugin cộng đồng. Dự án kế nhiệm là " + juggl_link.outerHTML + ". <br> " +
            "Xem " + doc_link.outerHTML + " để biết cách cài đặt và bắt đầu sử dụng. <br>" +
            "Tham gia " + discord_link.outerHTML + " để trao đổi và nhận thêm hỗ trợ."

        containerEl.appendChild(introPar);

        new Setting(containerEl)
            .setName("Mật khẩu cơ sở dữ liệu Neo4j")
            .setDesc("Mật khẩu của cơ sở dữ liệu đồ thị Neo4j. CẢNH BÁO: Mật khẩu được lưu dưới dạng văn bản thuần trong vault. " +
                "Không sử dụng mật khẩu nhạy cảm hoặc mật khẩu dùng chung với dịch vụ khác.")
            .addText(text => {
                text.setPlaceholder("")
                    .setValue(this.plugin.settings.password)
                    .onChange((new_folder) => {
                        this.plugin.settings.password = new_folder;
                        this.plugin.saveData(this.plugin.settings);
                    }).inputEl.setAttribute("type", "password")
            });

        containerEl.createEl('h3');
        containerEl.createEl('h3', {text: 'Giao diện'});

        new Setting(containerEl)
            .setName("Phân màu node")
            .setDesc("Chọn thuộc tính dùng để phân màu các node trên đồ thị. Cần khởi động lại luồng Neo4j để áp dụng.")
            .addDropdown(dropdown => dropdown
                .addOption('tags','Thẻ (Tags)')
                .addOption('folders','Thư mục')
                .addOption('none','Không phân màu')
                .setValue(this.plugin.settings.community)
                .onChange((value) => {
                    this.plugin.settings.community = value;
                    this.plugin.saveData(this.plugin.settings);
                }));


        new Setting(containerEl)
            .setName("Bố cục phân cấp")
            .setDesc("Sử dụng bố cục đồ thị phân cấp thay cho bố cục thông thường.")
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.hierarchical)
                    .onChange((new_value) => {
                        this.plugin.settings.hierarchical = new_value;
                        this.plugin.saveData(this.plugin.settings);
                    })
            });

        new Setting(containerEl)
            .setName("Hiển thị mũi tên")
            .setDesc("Hiển thị mũi tên trên các cạnh của đồ thị.")
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.show_arrows)
                    .onChange((new_value) => {
                        this.plugin.settings.show_arrows = new_value;
                        this.plugin.saveData(this.plugin.settings);
                    })
            });
        new Setting(containerEl)
            .setName("Hiển thị ngữ cảnh của liên kết inline")
            .setDesc("Hiển thị đoạn văn chứa liên kết inline trên cạnh tương ứng.")
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.inlineContext)
                    .onChange((new_value) => {
                        this.plugin.settings.inlineContext = new_value;
                        this.plugin.saveData(this.plugin.settings);
                    })
            });
        containerEl.createEl('h4');
        containerEl.createEl('h4', {text: 'Kiểu hiển thị node'});

        const div = document.createElement("div");
        div.className = "neovis_setting";
        this.containerEl.children[this.containerEl.children.length - 1].appendChild(div);
        div.setAttr("style", "height: 100%; width:100%");

        let input = div.createEl("textarea");
        input.placeholder = JSON.stringify(DefaultNodeSettings);
        input.value = this.plugin.settings.nodeSettings;
        input.onchange = (ev) => {
            this.plugin.settings.nodeSettings = input.value;
            this.plugin.saveData(this.plugin.settings);
            let leaves = this.plugin.app.workspace.getLeavesOfType(NV_VIEW_TYPE);
            leaves.forEach((leaf) =>{
                (leaf.view as NeoVisView).updateStyle();
            });
        };
        input.setAttr("style", "height: 300px; width: 100%; " +
            "-webkit-box-sizing: border-box; -moz-box-sizing: border-box;  box-sizing: border-box;");

        let temp_link = document.createElement("a");
        temp_link.href = "https://publish.obsidian.md/semantic-obsidian/Node+styling";
        temp_link.target = '_blank';
        temp_link.innerHTML ='liên kết này';

        let par = document.createElement("p");
        par.innerHTML = "Cấu hình kiểu hiển thị node ở định dạng JSON. <br>" +
            "Dùng {\"defaultStyle\": {}} để đặt kiểu mặc định cho node. " +
            "Dùng {\"image\": {}} để định dạng node hình ảnh và {\"SMD_dangling\": {}} cho ghi chú chưa tồn tại. <br>" +
            "Khi phân màu theo Thư mục, dùng đường dẫn thư mục làm khóa; thư mục gốc dùng khóa {\"/\": {}}. <br>" +
            "Xem " + temp_link.outerHTML + " để biết thêm về cách định dạng node."

        containerEl.appendChild(par);

        containerEl.createEl('h4');
        containerEl.createEl('h4', {text: 'Kiểu hiển thị cạnh'});

        const div2 = document.createElement("div");
        div2.className = "neovis_setting2";
        this.containerEl.children[this.containerEl.children.length - 1].appendChild(div2);
        div2.setAttr("style", "height: 100%; width:100%");

        let input2 = div2.createEl("textarea");
        input2.placeholder = JSON.stringify(DefaultEdgeSettings);
        input2.value = this.plugin.settings.edgeSettings;
        input2.onchange = (ev) => {
            this.plugin.settings.edgeSettings = input2.value;
            this.plugin.saveData(this.plugin.settings);
            let leaves = this.plugin.app.workspace.getLeavesOfType(NV_VIEW_TYPE);
            leaves.forEach((leaf) =>{
                (leaf.view as NeoVisView).updateStyle();
            });
        };
        input2.setAttr("style", "height: 300px; width: 100%; " +
            "-webkit-box-sizing: border-box; -moz-box-sizing: border-box;  box-sizing: border-box;");

        let temp_link2 = document.createElement("a");
        temp_link2.href = "https://publish.obsidian.md/semantic-obsidian/Edge+styling";
        temp_link2.target = '_blank';
        temp_link2.innerHTML = 'liên kết này';

        let par2 = document.createElement("p");
        par2.innerHTML = "Cấu hình kiểu hiển thị cạnh ở định dạng JSON. <br>" +
            "Khóa đầu tiên xác định loại liên kết được áp dụng kiểu hiển thị. " +
            "Dùng {\"defaultStyle\": {}} cho kiểu mặc định và {\"inline\": {}} cho các liên kết không có kiểu. " +
            "Xem " + temp_link2.outerHTML + " để biết thêm về cách định dạng cạnh."

        containerEl.appendChild(par2);


        containerEl.createEl('h3');
        containerEl.createEl('h3', {text: 'Nâng cao'});

        new Setting(containerEl)
            .setName("Tự động mở rộng")
            .setDesc("Tự động mở rộng vùng lân cận quanh node khi node được nhấp hoặc thêm vào đồ thị. " +
                "Thông thường thao tác này chỉ xảy ra khi nhấn E hoặc nhấp đúp.")
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.auto_expand)
                    .onChange((new_value) => {
                        this.plugin.settings.auto_expand = new_value;
                        this.plugin.saveData(this.plugin.settings);
                    })
            });
        new Setting(containerEl)
            .setName("Tự động thêm node")
            .setDesc("Tự động thêm node vào đồ thị mỗi khi một ghi chú được mở.")
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.auto_add_nodes)
                    .onChange((new_value) => {
                        this.plugin.settings.auto_add_nodes = new_value;
                        this.plugin.saveData(this.plugin.settings);
                    })
            });

        new Setting(containerEl)
            .setName("Chuyển đổi Markdown")
            .setDesc("Khi bật, máy chủ sẽ chuyển nội dung ghi chú sang HTML. Việc này có thể làm giảm hiệu năng. " +
                "Tắt tùy chọn để tăng hiệu năng, đổi lại phần xem trước khi rê chuột trên đồ thị có thể không hiển thị đúng.")
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.convert_markdown)
                    .onChange((new_value) => {
                        this.plugin.settings.convert_markdown = new_value;
                        this.plugin.saveData(this.plugin.settings);
                    })
            });

        new Setting(containerEl)
            .setName("Lập chỉ mục nội dung ghi chú")
            .setDesc("Lập chỉ mục toàn văn cho nội dung ghi chú để có thể tìm kiếm bên trong ghi chú bằng Neo4j Bloom. " +
                "Tính năng này có thể làm giảm hiệu năng.")
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.index_content)
                    .onChange((new_value) => {
                        this.plugin.settings.index_content = new_value;
                        this.plugin.saveData(this.plugin.settings);
                    })
            });

        new Setting(containerEl)
            .setName("Tiền tố của typed link")
            .setDesc("Tiền tố dùng cho liên kết có kiểu. Mặc định là '-'. Cần khởi động lại luồng Neo4j để áp dụng.")
            .addText(text => {
                text.setPlaceholder("")
                    .setValue(this.plugin.settings.typed_link_prefix)
                    .onChange((new_folder) => {
                        this.plugin.settings.typed_link_prefix = new_folder;
                        this.plugin.saveData(this.plugin.settings);
                    })
            });

        new Setting(containerEl)
            .setName("Cổng máy chủ hình ảnh")
            .setDesc("Đặt cổng cho máy chủ hình ảnh. Nếu dùng nhiều vault, mỗi vault nên dùng một cổng khác nhau. Mặc định: 3000.")
            .addText(text => {
                text.setValue(this.plugin.settings.imgServerPort + '')
                    .setPlaceholder('3000')
                    .onChange((new_value) => {
                        this.plugin.settings.imgServerPort = parseInt(new_value.trim());
                        this.plugin.saveData(this.plugin.settings);
                    })
            });

        new Setting(containerEl)
            .setName("Gỡ lỗi")
            .setDesc("Bật chế độ debug. Chế độ này ghi nhiều thông tin vào Developer Console và cần khởi động lại luồng Neo4j để áp dụng.")
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.debug)
                    .onChange((new_value) => {
                        this.plugin.settings.debug = new_value;
                        this.plugin.saveData(this.plugin.settings);
                    })
            });


    }
}