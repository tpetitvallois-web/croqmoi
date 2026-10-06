// Détoure le sujet principal d'une photo (macOS Vision, "lift subject") -> PNG transparent.
// Usage : swift cutout.swift in.jpg out.png
import Foundation
import Vision
import CoreImage
import AppKit

let args = CommandLine.arguments
guard args.count == 3 else { fputs("usage: cutout in out.png\n", stderr); exit(2) }
let inURL = URL(fileURLWithPath: args[1]), outURL = URL(fileURLWithPath: args[2])
guard let ci = CIImage(contentsOf: inURL) else { fputs("lecture impossible\n", stderr); exit(1) }

let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: ci, options: [:])
try handler.perform([req])
guard let res = req.results?.first else { fputs("aucun sujet détecté\n", stderr); exit(3) }
let maskPB = try res.generateMaskedImage(ofInstances: res.allInstances, from: handler, croppedToInstancesExtent: false)
let out = CIImage(cvPixelBuffer: maskPB)
let ctx = CIContext()
guard let png = ctx.pngRepresentation(of: out, format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!) else { exit(4) }
try png.write(to: outURL)
print("ok \(res.allInstances.count) instance(s)")
