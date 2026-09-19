import QtQuick

// Mirrors the `glass` inline style object from the web app:
// rgba(255,255,255,0.05) fill, blur(20px), 1px rgba(255,255,255,0.09) border,
// 22px radius, soft outer shadow + inner top highlight.
//
// Usage: set `width` explicitly, nest content directly as children.
// The card's height auto-fits its content (see body.childrenRect).
Item {
    id: root
    default property alias data: body.data
    property int cardRadius: 22

    height: body.childrenRect.height

    // drop shadow (approximates 0 4px 24px rgba(0,0,0,0.2))
    Rectangle {
        anchors.fill: parent
        anchors.topMargin: 4
        radius: root.cardRadius
        color: "#33000000"
        z: -1
    }

    Rectangle {
        anchors.fill: parent
        radius: root.cardRadius
        color: "#0DFFFFFF"          // rgba(255,255,255,0.05)
        border.color: "#17FFFFFF"   // rgba(255,255,255,0.09)
        border.width: 1
    }

    Item {
        id: body
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
    }
}
