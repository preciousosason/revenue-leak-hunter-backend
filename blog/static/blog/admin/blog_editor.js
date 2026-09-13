(function () {

    "use strict";


    /* =================================
       BLOCK DEFINITIONS
    ================================= */

    const BLOCK_TYPES = {

        heading: {
            label: "Heading",
            icon: "H",
            create: () => ({
                type: "heading",
                level: 2,
                text: ""
            })
        },

        paragraph: {
            label: "Paragraph",
            icon: "¶",
            create: () => ({
                type: "paragraph",
                text: ""
            })
        },

        quote: {
            label: "Quote",
            icon: "❝",
            create: () => ({
                type: "quote",
                text: "",
                attribution: ""
            })
        },

        bullet_list: {
            label: "Bullet List",
            icon: "•",
            create: () => ({
                type: "bullet_list",
                items: [""]
            })
        },

        numbered_list: {
            label: "Numbered List",
            icon: "1.",
            create: () => ({
                type: "numbered_list",
                items: [""]
            })
        },

        image: {
            label: "Image",
            icon: "▧",
            create: () => ({
                type: "image",
                url: "",
                alt: "",
                caption: ""
            })
        },

        link: {
            label: "Link",
            icon: "↗",
            create: () => ({
                type: "link",
                text: "",
                url: "",
                new_tab: true
            })
        },

        button: {
            label: "Button / CTA",
            icon: "▣",
            create: () => ({
                type: "button",
                text: "Learn More",
                url: "",
                new_tab: false
            })
        },

        callout: {
            label: "Callout",
            icon: "!",
            create: () => ({
                type: "callout",
                title: "",
                text: ""
            })
        },

        divider: {
            label: "Divider",
            icon: "―",
            create: () => ({
                type: "divider"
            })
        },

        spacer: {
            label: "Spacer",
            icon: "↕",
            create: () => ({
                type: "spacer",
                height: 32
            })
        },

        youtube: {
            label: "YouTube Video",
            icon: "▶",
            create: () => ({
                type: "youtube",
                url: "",
                title: ""
            })
        },

        code: {
            label: "Code",
            icon: "</>",
            create: () => ({
                type: "code",
                language: "",
                code: ""
            })
        }

    };


    let blocks = [];

    let hiddenField = null;

    let editor = null;


    /* =================================
       DOM HELPERS
    ================================= */

    function createElement(
        tag,
        className = "",
        text = ""
    ) {

        const element =
            document.createElement(tag);

        if (className) {
            element.className =
                className;
        }

        if (text) {
            element.textContent =
                text;
        }

        return element;

    }


    function createInput(
        label,
        value = "",
        type = "text"
    ) {

        const wrapper =
            createElement(
                "div",
                "ble-field"
            );

        const labelElement =
            createElement(
                "label",
                "ble-label",
                label
            );

        const input =
            document.createElement(
                "input"
            );

        input.type = type;
        input.value = value;

        input.className =
            "ble-input";

        wrapper.appendChild(
            labelElement
        );

        wrapper.appendChild(
            input
        );

        return {
            wrapper,
            input
        };

    }


    function createTextarea(
        label,
        value = ""
    ) {

        const wrapper =
            createElement(
                "div",
                "ble-field"
            );

        const labelElement =
            createElement(
                "label",
                "ble-label",
                label
            );

        const textarea =
            document.createElement(
                "textarea"
            );

        textarea.value =
            value;

        textarea.className =
            "ble-textarea";

        wrapper.appendChild(
            labelElement
        );

        wrapper.appendChild(
            textarea
        );

        return {
            wrapper,
            textarea
        };

    }


    function createSelect(
        label,
        value,
        options
    ) {

        const wrapper =
            createElement(
                "div",
                "ble-field"
            );

        const labelElement =
            createElement(
                "label",
                "ble-label",
                label
            );

        const select =
            document.createElement(
                "select"
            );

        select.className =
            "ble-input";

        options.forEach(option => {

            const optionElement =
                document.createElement(
                    "option"
                );

            optionElement.value =
                option.value;

            optionElement.textContent =
                option.label;

            if (
                String(option.value) ===
                String(value)
            ) {

                optionElement.selected =
                    true;

            }

            select.appendChild(
                optionElement
            );

        });

        wrapper.appendChild(
            labelElement
        );

        wrapper.appendChild(
            select
        );

        return {
            wrapper,
            select
        };

    }


    function createCheckbox(
        label,
        checked
    ) {

        const wrapper =
            createElement(
                "label",
                "ble-checkbox"
            );

        const input =
            document.createElement(
                "input"
            );

        input.type =
            "checkbox";

        input.checked =
            Boolean(checked);

        const text =
            createElement(
                "span",
                "",
                label
            );

        wrapper.appendChild(
            input
        );

        wrapper.appendChild(
            text
        );

        return {
            wrapper,
            input
        };

    }


    /* =================================
       SYNC JSON
    ================================= */

    function syncBlocks() {

        if (!hiddenField) {
            return;
        }

        hiddenField.value =
            JSON.stringify(
                blocks
            );

    }


    /* =================================
       ADD BLOCK
    ================================= */

    function addBlock(
        type,
        index = blocks.length
    ) {

        if (!BLOCK_TYPES[type]) {
            return;
        }

        const block =
            BLOCK_TYPES[type].create();

        blocks.splice(
            index,
            0,
            block
        );

        render();

        syncBlocks();

    }


    /* =================================
       REMOVE BLOCK
    ================================= */

    function removeBlock(index) {

        blocks.splice(
            index,
            1
        );

        render();

        syncBlocks();

    }


    /* =================================
       MOVE BLOCK
    ================================= */

    function moveBlock(
        from,
        to
    ) {

        if (
            to < 0 ||
            to >= blocks.length
        ) {
            return;
        }

        const block =
            blocks.splice(
                from,
                1
            )[0];

        blocks.splice(
            to,
            0,
            block
        );

        render();

        syncBlocks();

    }


    /* =================================
       DUPLICATE BLOCK
    ================================= */

    function duplicateBlock(index) {

        const copy =
            JSON.parse(
                JSON.stringify(
                    blocks[index]
                )
            );

        blocks.splice(
            index + 1,
            0,
            copy
        );

        render();

        syncBlocks();

    }


    /* =================================
       UPDATE FIELD
    ================================= */

    function updateBlock(
        index,
        key,
        value
    ) {

        blocks[index][key] =
            value;

        syncBlocks();

    }


    /* =================================
       RENDER HEADING
    ================================= */

    function renderHeadingFields(
        container,
        block,
        index
    ) {

        const level =
            createSelect(
                "Heading Level",
                block.level || 2,
                [
                    {
                        value: 1,
                        label: "H1"
                    },
                    {
                        value: 2,
                        label: "H2"
                    },
                    {
                        value: 3,
                        label: "H3"
                    }
                ]
            );

        level.select.addEventListener(
            "change",
            () => {

                updateBlock(
                    index,
                    "level",
                    Number(
                        level.select.value
                    )
                );

            }
        );

        container.appendChild(
            level.wrapper
        );


        const text =
            createInput(
                "Heading Text",
                block.text || ""
            );

        text.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "text",
                    text.input.value
                );

            }
        );

        container.appendChild(
            text.wrapper
        );

    }


    /* =================================
       RENDER PARAGRAPH
    ================================= */

    function renderParagraphFields(
        container,
        block,
        index
    ) {

        const field =
            createTextarea(
                "Paragraph",
                block.text || ""
            );

        field.textarea.rows =
            5;

        field.textarea.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "text",
                    field.textarea.value
                );

            }
        );

        container.appendChild(
            field.wrapper
        );

    }


    /* =================================
       RENDER QUOTE
    ================================= */

    function renderQuoteFields(
        container,
        block,
        index
    ) {

        const quote =
            createTextarea(
                "Quote",
                block.text || ""
            );

        quote.textarea.rows =
            4;

        quote.textarea.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "text",
                    quote.textarea.value
                );

            }
        );

        container.appendChild(
            quote.wrapper
        );


        const attribution =
            createInput(
                "Attribution",
                block.attribution || ""
            );

        attribution.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "attribution",
                    attribution.input.value
                );

            }
        );

        container.appendChild(
            attribution.wrapper
        );

    }


    /* =================================
       RENDER LIST
    ================================= */

    function renderListFields(
        container,
        block,
        index
    ) {

        const list =
            createElement(
                "div",
                "ble-list-editor"
            );

        const items =
            Array.isArray(block.items)
                ? block.items
                : [""];

        items.forEach(
            (item, itemIndex) => {

                const row =
                    createElement(
                        "div",
                        "ble-list-row"
                    );

                const input =
                    document.createElement(
                        "input"
                    );

                input.type =
                    "text";

                input.className =
                    "ble-input";

                input.value =
                    item || "";

                input.placeholder =
                    `List item ${itemIndex + 1}`;

                input.addEventListener(
                    "input",
                    () => {

                        blocks[index]
                            .items[itemIndex] =
                                input.value;

                        syncBlocks();

                    }
                );


                const remove =
                    createElement(
                        "button",
                        "ble-small-button",
                        "×"
                    );

                remove.type =
                    "button";

                remove.title =
                    "Remove item";

                remove.addEventListener(
                    "click",
                    () => {

                        blocks[index]
                            .items
                            .splice(
                                itemIndex,
                                1
                            );

                        if (
                            blocks[index]
                                .items.length === 0
                        ) {

                            blocks[index]
                                .items.push("");

                        }

                        render();

                        syncBlocks();

                    }
                );


                row.appendChild(
                    input
                );

                row.appendChild(
                    remove
                );

                list.appendChild(
                    row
                );

            }
        );


        const add =
            createElement(
                "button",
                "ble-secondary-button",
                "+ Add item"
            );

        add.type =
            "button";

        add.addEventListener(
            "click",
            () => {

                blocks[index]
                    .items
                    .push("");

                render();

                syncBlocks();

            }
        );

        list.appendChild(
            add
        );

        container.appendChild(
            list
        );

    }


    /* =================================
       RENDER IMAGE
    ================================= */

    function renderImageFields(
        container,
        block,
        index
    ) {

        const url =
            createInput(
                "Image URL",
                block.url || ""
            );

        url.input.placeholder =
            "https://example.com/image.jpg";

        url.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "url",
                    url.input.value
                );

            }
        );

        container.appendChild(
            url.wrapper
        );


        const alt =
            createInput(
                "Alt Text",
                block.alt || ""
            );

        alt.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "alt",
                    alt.input.value
                );

            }
        );

        container.appendChild(
            alt.wrapper
        );


        const caption =
            createInput(
                "Caption",
                block.caption || ""
            );

        caption.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "caption",
                    caption.input.value
                );

            }
        );

        container.appendChild(
            caption.wrapper
        );

    }


    /* =================================
       RENDER LINK
    ================================= */

    function renderLinkFields(
        container,
        block,
        index
    ) {

        const text =
            createInput(
                "Link Text",
                block.text || ""
            );

        text.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "text",
                    text.input.value
                );

            }
        );

        container.appendChild(
            text.wrapper
        );


        const url =
            createInput(
                "URL",
                block.url || ""
            );

        url.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "url",
                    url.input.value
                );

            }
        );

        container.appendChild(
            url.wrapper
        );


        const newTab =
            createCheckbox(
                "Open in new tab",
                block.new_tab
            );

        newTab.input.addEventListener(
            "change",
            () => {

                updateBlock(
                    index,
                    "new_tab",
                    newTab.input.checked
                );

            }
        );

        container.appendChild(
            newTab.wrapper
        );

    }


    /* =================================
       RENDER BUTTON
    ================================= */

    function renderButtonFields(
        container,
        block,
        index
    ) {

        const text =
            createInput(
                "Button Text",
                block.text || "Learn More"
            );

        text.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "text",
                    text.input.value
                );

            }
        );

        container.appendChild(
            text.wrapper
        );


        const url =
            createInput(
                "Button URL",
                block.url || ""
            );

        url.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "url",
                    url.input.value
                );

            }
        );

        container.appendChild(
            url.wrapper
        );


        const newTab =
            createCheckbox(
                "Open in new tab",
                block.new_tab
            );

        newTab.input.addEventListener(
            "change",
            () => {

                updateBlock(
                    index,
                    "new_tab",
                    newTab.input.checked
                );

            }
        );

        container.appendChild(
            newTab.wrapper
        );

    }


    /* =================================
       RENDER CALLOUT
    ================================= */

    function renderCalloutFields(
        container,
        block,
        index
    ) {

        const title =
            createInput(
                "Callout Title",
                block.title || ""
            );

        title.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "title",
                    title.input.value
                );

            }
        );

        container.appendChild(
            title.wrapper
        );


        const text =
            createTextarea(
                "Callout Text",
                block.text || ""
            );

        text.textarea.rows =
            4;

        text.textarea.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "text",
                    text.textarea.value
                );

            }
        );

        container.appendChild(
            text.wrapper
        );

    }


    /* =================================
       RENDER SPACER
    ================================= */

    function renderSpacerFields(
        container,
        block,
        index
    ) {

        const height =
            createInput(
                "Height (px)",
                block.height || 32,
                "number"
            );

        height.input.min =
            8;

        height.input.max =
            300;

        height.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "height",
                    Number(
                        height.input.value
                    )
                );

            }
        );

        container.appendChild(
            height.wrapper
        );

    }


    /* =================================
       RENDER YOUTUBE
    ================================= */

    function renderYouTubeFields(
        container,
        block,
        index
    ) {

        const url =
            createInput(
                "YouTube URL",
                block.url || ""
            );

        url.input.placeholder =
            "https://www.youtube.com/watch?v=...";

        url.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "url",
                    url.input.value
                );

            }
        );

        container.appendChild(
            url.wrapper
        );


        const title =
            createInput(
                "Video Title",
                block.title || ""
            );

        title.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "title",
                    title.input.value
                );

            }
        );

        container.appendChild(
            title.wrapper
        );

    }


    /* =================================
       RENDER CODE
    ================================= */

    function renderCodeFields(
        container,
        block,
        index
    ) {

        const language =
            createInput(
                "Language",
                block.language || ""
            );

        language.input.placeholder =
            "javascript, python, html...";

        language.input.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "language",
                    language.input.value
                );

            }
        );

        container.appendChild(
            language.wrapper
        );


        const code =
            createTextarea(
                "Code",
                block.code || ""
            );

        code.textarea.rows =
            12;

        code.textarea.classList.add(
            "ble-code"
        );

        code.textarea.addEventListener(
            "input",
            () => {

                updateBlock(
                    index,
                    "code",
                    code.textarea.value
                );

            }
        );

        container.appendChild(
            code.wrapper
        );

    }


    /* =================================
       RENDER BLOCK FIELDS
    ================================= */

    function renderBlockFields(
        container,
        block,
        index
    ) {

        switch (block.type) {

            case "heading":
                renderHeadingFields(
                    container,
                    block,
                    index
                );
                break;

            case "paragraph":
                renderParagraphFields(
                    container,
                    block,
                    index
                );
                break;

            case "quote":
                renderQuoteFields(
                    container,
                    block,
                    index
                );
                break;

            case "bullet_list":
            case "numbered_list":
                renderListFields(
                    container,
                    block,
                    index
                );
                break;

            case "image":
                renderImageFields(
                    container,
                    block,
                    index
                );
                break;

            case "link":
                renderLinkFields(
                    container,
                    block,
                    index
                );
                break;

            case "button":
                renderButtonFields(
                    container,
                    block,
                    index
                );
                break;

            case "callout":
                renderCalloutFields(
                    container,
                    block,
                    index
                );
                break;

            case "spacer":
                renderSpacerFields(
                    container,
                    block,
                    index
                );
                break;

            case "youtube":
                renderYouTubeFields(
                    container,
                    block,
                    index
                );
                break;

            case "code":
                renderCodeFields(
                    container,
                    block,
                    index
                );
                break;

            case "divider":

                const message =
                    createElement(
                        "p",
                        "ble-empty-message",
                        "This block adds a visual divider to the article."
                    );

                container.appendChild(
                    message
                );

                break;

            default:

                const unknown =
                    createElement(
                        "p",
                        "ble-warning",
                        `Unknown block type: ${block.type}`
                    );

                container.appendChild(
                    unknown
                );

        }

    }


    /* =================================
       BLOCK TOOLBAR
    ================================= */

    function createBlockToolbar(
        index,
        block
    ) {

        const toolbar =
            createElement(
                "div",
                "ble-block-toolbar"
            );


        const left =
            createElement(
                "div",
                "ble-toolbar-left"
            );


        const drag =
            createElement(
                "span",
                "ble-drag-handle",
                "⋮⋮"
            );

        drag.title =
            "Drag to reorder";

        left.appendChild(
            drag
        );


        const icon =
            createElement(
                "span",
                "ble-block-icon",
                BLOCK_TYPES[block.type]
                    ? BLOCK_TYPES[block.type].icon
                    : "?"
            );

        left.appendChild(
            icon
        );


        const label =
            createElement(
                "strong",
                "ble-block-label",
                BLOCK_TYPES[block.type]
                    ? BLOCK_TYPES[block.type].label
                    : block.type
            );

        left.appendChild(
            label
        );


        toolbar.appendChild(
            left
        );


        const actions =
            createElement(
                "div",
                "ble-block-actions"
            );


        const up =
            createElement(
                "button",
                "ble-action-button",
                "↑"
            );

        up.type =
            "button";

        up.title =
            "Move up";

        up.disabled =
            index === 0;

        up.addEventListener(
            "click",
            () => moveBlock(
                index,
                index - 1
            )
        );


        const down =
            createElement(
                "button",
                "ble-action-button",
                "↓"
            );

        down.type =
            "button";

        down.title =
            "Move down";

        down.disabled =
            index === blocks.length - 1;

        down.addEventListener(
            "click",
            () => moveBlock(
                index,
                index + 1
            )
        );


        const duplicate =
            createElement(
                "button",
                "ble-action-button",
                "⧉"
            );

        duplicate.type =
            "button";

        duplicate.title =
            "Duplicate";

        duplicate.addEventListener(
            "click",
            () => duplicateBlock(
                index
            )
        );


        const remove =
            createElement(
                "button",
                "ble-action-button ble-delete-button",
                "×"
            );

        remove.type =
            "button";

        remove.title =
            "Delete block";

        remove.addEventListener(
            "click",
            () => {

                if (
                    confirm(
                        "Delete this block?"
                    )
                ) {

                    removeBlock(
                        index
                    );

                }

            }
        );


        actions.appendChild(
            up
        );

        actions.appendChild(
            down
        );

        actions.appendChild(
            duplicate
        );

        actions.appendChild(
            remove
        );

        toolbar.appendChild(
            actions
        );

        return toolbar;

    }


    /* =================================
       RENDER BLOCK
    ================================= */

    function renderBlock(
        block,
        index
    ) {

        const card =
            createElement(
                "article",
                "ble-block"
            );

        card.draggable =
            true;

        card.dataset.index =
            index;


        card.appendChild(
            createBlockToolbar(
                index,
                block
            )
        );


        const body =
            createElement(
                "div",
                "ble-block-body"
            );

        renderBlockFields(
            body,
            block,
            index
        );

        card.appendChild(
            body
        );


        card.addEventListener(
            "dragstart",
            event => {

                card.classList.add(
                    "ble-dragging"
                );

                event.dataTransfer.effectAllowed =
                    "move";

                event.dataTransfer.setData(
                    "text/plain",
                    String(index)
                );

            }
        );


        card.addEventListener(
            "dragend",
            () => {

                card.classList.remove(
                    "ble-dragging"
                );

                document
                    .querySelectorAll(
                        ".ble-block"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "ble-drag-over"
                            )
                    );

            }
        );


        card.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

                card.classList.add(
                    "ble-drag-over"
                );

            }
        );


        card.addEventListener(
            "dragleave",
            () => {

                card.classList.remove(
                    "ble-drag-over"
                );

            }
        );


        card.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                card.classList.remove(
                    "ble-drag-over"
                );

                const from =
                    Number(
                        event.dataTransfer.getData(
                            "text/plain"
                        )
                    );

                const to =
                    Number(
                        card.dataset.index
                    );

                if (
                    Number.isInteger(from) &&
                    Number.isInteger(to) &&
                    from !== to
                ) {

                    const moved =
                        blocks.splice(
                            from,
                            1
                        )[0];

                    blocks.splice(
                        to,
                        0,
                        moved
                    );

                    render();

                    syncBlocks();

                }

            }
        );


        return card;

    }


    /* =================================
       ADD BLOCK MENU
    ================================= */

    function createAddMenu() {

        const wrapper =
            createElement(
                "div",
                "ble-add-area"
            );


        const button =
            createElement(
                "button",
                "ble-add-button",
                "+ Add Block"
            );

        button.type =
            "button";


        const menu =
            createElement(
                "div",
                "ble-add-menu"
            );

        menu.hidden =
            true;


        Object.entries(
            BLOCK_TYPES
        ).forEach(
            ([type, definition]) => {

                const item =
                    createElement(
                        "button",
                        "ble-menu-item"
                    );

                item.type =
                    "button";

                const icon =
                    createElement(
                        "span",
                        "ble-menu-icon",
                        definition.icon
                    );

                const label =
                    createElement(
                        "span",
                        "",
                        definition.label
                    );

                item.appendChild(
                    icon
                );

                item.appendChild(
                    label
                );

                item.addEventListener(
                    "click",
                    () => {

                        addBlock(
                            type
                        );

                        menu.hidden =
                            true;

                    }
                );

                menu.appendChild(
                    item
                );

            }
        );


        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                menu.hidden =
                    !menu.hidden;

            }
        );


        document.addEventListener(
            "click",
            () => {

                menu.hidden =
                    true;

            }
        );


        wrapper.appendChild(
            button
        );

        wrapper.appendChild(
            menu
        );

        return wrapper;

    }


    /* =================================
       RENDER EDITOR
    ================================= */

    function render() {

        if (!editor) {
            return;
        }

        editor.innerHTML =
            "";


        const header =
            createElement(
                "div",
                "ble-editor-header"
            );

        const title =
            createElement(
                "div"
            );

        const heading =
            createElement(
                "h2",
                "",
                "Article Content"
            );

        const description =
            createElement(
                "p",
                "",
                "Build your article using blocks. Drag blocks to reorder them."
            );

        title.appendChild(
            heading
        );

        title.appendChild(
            description
        );


        header.appendChild(
            title
        );

        editor.appendChild(
            header
        );


        const blocksContainer =
            createElement(
                "div",
                "ble-blocks"
            );


        if (!blocks.length) {

            const empty =
                createElement(
                    "div",
                    "ble-empty",
                    "Your article is empty. Add your first block below."
                );

            blocksContainer.appendChild(
                empty
            );

        } else {

            blocks.forEach(
                (block, index) => {

                    blocksContainer.appendChild(
                        renderBlock(
                            block,
                            index
                        )
                    );

                }
            );

        }


        editor.appendChild(
            blocksContainer
        );


        editor.appendChild(
            createAddMenu()
        );

    }


    /* =================================
       LOAD INITIAL BLOCKS
    ================================= */

    function loadBlocks() {

        if (!hiddenField) {
            blocks = [];
            return;
        }

        const raw =
            hiddenField.value;

        if (!raw) {
            blocks = [];
            return;
        }

        try {

            const parsed =
                JSON.parse(raw);

            blocks =
                Array.isArray(parsed)
                    ? parsed
                    : [];

        } catch (error) {

            console.error(
                "Could not parse blog blocks:",
                error
            );

            blocks = [];

        }

    }


    /* =================================
       HIDE LEGACY CONTENT
    ================================= */

    function hideLegacyContent() {

        const contentField =
            document.getElementById(
                "id_content"
            );

        if (!contentField) {
            return;
        }

        const row =
            contentField.closest(
                ".form-row"
            );

        if (row) {
            row.style.display =
                "none";
        }

    }


    /* =================================
       MOVE EDITOR INTO CONTENT FIELDSET
    ================================= */

    function positionEditor() {

        const blocksRow =
            hiddenField
                ? hiddenField.closest(
                    ".form-row"
                )
                : null;

        if (!blocksRow) {
            return;
        }

        const fieldset =
            blocksRow.closest(
                "fieldset"
            );

        if (!fieldset) {
            return;
        }

        fieldset.insertBefore(
            editor,
            blocksRow
        );

        blocksRow.style.display =
            "none";

    }


    /* =================================
       FORM SUBMIT
    ================================= */

    function attachFormHandler() {

        const form =
            document.querySelector(
                "#blog-block-editor"
            )?.closest(
                "form"
            );

        if (!form) {
            return;
        }

        form.addEventListener(
            "submit",
            () => {

                syncBlocks();

            }
        );

    }


    /* =================================
       INITIALIZE
    ================================= */

    function initialize() {

        editor =
            document.getElementById(
                "blog-block-editor"
            );

        if (!editor) {
            return;
        }


        const fieldId =
            editor.dataset
                .blocksFieldId;

        hiddenField =
            document.getElementById(
                fieldId
            );

        if (!hiddenField) {

            console.error(
                "Blog blocks field was not found."
            );

            return;

        }


        loadBlocks();

        hideLegacyContent();

        positionEditor();

        render();

        syncBlocks();

        attachFormHandler();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }

})();
