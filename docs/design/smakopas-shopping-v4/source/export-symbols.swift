// Exports system symbol artwork for static Apple-platform design studies only.
import AppKit

let destination = URL(fileURLWithPath: CommandLine.arguments[1], isDirectory: true)
let names = ["book.closed", "book.closed.fill", "bubble.left.and.bubble.right", "checklist", "plus", "magnifyingglass", "person.crop.circle", "chevron.left", "chevron.right", "xmark", "ellipsis", "camera", "photo.on.rectangle", "trash", "arrow.up", "arrow.down", "doc.text", "bookmark", "square.and.arrow.down", "square.and.pencil", "sidebar.left", "wifi", "cellularbars", "battery.100", "checkmark", "arrow.up.left.and.arrow.down.right", "arrow.right"]
let colors: [(String, NSColor)] = [
    ("ink", NSColor(srgbRed: 0.11, green: 0.12, blue: 0.13, alpha: 1)),
    ("muted", NSColor(srgbRed: 0.35, green: 0.38, blue: 0.41, alpha: 1)),
    ("accent", NSColor(srgbRed: 0.055, green: 0.486, blue: 0.439, alpha: 1)),
    ("white", .white)
]
for name in names {
    guard let symbol = NSImage(systemSymbolName: name, accessibilityDescription: nil) else {
        fatalError("Missing system symbol: \(name)")
    }
    for (variant, color) in colors {
        let configuration = NSImage.SymbolConfiguration(pointSize: 32, weight: .regular)
            .applying(.init(paletteColors: [color]))
        let image = symbol.withSymbolConfiguration(configuration)!
        let bitmap = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: 96, pixelsHigh: 96,
            bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
            colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
        NSGraphicsContext.saveGraphicsState()
        NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: bitmap)
        let scale = min(78 / image.size.width, 78 / image.size.height)
        let size = NSSize(width: image.size.width * scale, height: image.size.height * scale)
        image.draw(in: NSRect(x: (96 - size.width) / 2, y: (96 - size.height) / 2,
            width: size.width, height: size.height))
        NSGraphicsContext.restoreGraphicsState()
        let data = bitmap.representation(using: .png, properties: [:])!
        try data.write(to: destination.appendingPathComponent("\(name)-\(variant).png"))
    }
}
print("Exported \(names.count * colors.count) system symbol assets")
