import QtQuick

// Renders a pre-colored Lucide SVG icon. Alpha/opacity variants (matching
// the site's rgba(255,255,255,X) icon colors) are done via plain Item
// opacity on top of a solid "white" source — no shader effects/extra
// modules needed, just two baked color sets (white/gray).
Item {
    id: root

    property string name: "sun"      // matches icons/<white|gray>/<name>.svg
    property int iconSize: 20
    property string tint: "white"    // "white" | "gray"

    implicitWidth: iconSize
    implicitHeight: iconSize

    Image {
        anchors.fill: parent
        source: "../icons/" + root.tint + "/" + root.name + ".svg"
        sourceSize.width: root.iconSize * 2
        sourceSize.height: root.iconSize * 2
        fillMode: Image.PreserveAspectFit
        smooth: true
    }
}
