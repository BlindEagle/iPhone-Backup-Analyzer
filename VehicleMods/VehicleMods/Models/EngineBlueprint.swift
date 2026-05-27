import Foundation
import SwiftData

enum FuelType: String, Codable, CaseIterable {
    case gasoline = "Gasoline"
    case diesel = "Diesel"
    case flex = "Flex (E85)"
    case electric = "Electric"
    case hybrid = "Hybrid"
    case hydrogen = "Hydrogen"
}

enum AspirationType: String, Codable, CaseIterable {
    case naturallyAspirated = "Naturally Aspirated"
    case turbocharged = "Turbocharged"
    case supercharged = "Supercharged"
    case twinTurbo = "Twin Turbo"
    case twinScrew = "Twin Screw"
    case centrifugal = "Centrifugal"
    case compound = "Compound"
}

enum EngineLayout: String, Codable, CaseIterable {
    case inline4 = "Inline-4"
    case inline5 = "Inline-5"
    case inline6 = "Inline-6"
    case v6 = "V6"
    case v8 = "V8"
    case v10 = "V10"
    case v12 = "V12"
    case flat4 = "Flat-4 (Boxer)"
    case flat6 = "Flat-6 (Boxer)"
    case rotary = "Rotary"
    case other = "Other"
}

@Model
final class EngineBlueprint {
    var id: UUID
    var updatedAt: Date

    // Block & Displacement
    var layout: EngineLayout
    var displacement: Double        // liters
    var bore: Double                // mm
    var stroke: Double              // mm
    var compressionRatio: Double
    var blockMaterial: String

    // Head
    var headMaterial: String
    var valvesPerCylinder: Int
    var camshaftType: String        // e.g. "DOHC", "SOHC", "OHV"

    // Aspiration
    var aspirationType: AspirationType
    var boostPressure: Double       // psi, 0 if N/A
    var intercooled: Bool

    // Fuel
    var fuelType: FuelType
    var injectionType: String       // e.g. "Port", "Direct", "Carbureted"
    var targetAFR: Double

    // Output (measured/estimated)
    var horsepowerAtWheel: Double
    var horsepowerAtCrank: Double
    var torqueAtWheel: Double
    var torqueAtCrank: Double

    // Tune info
    var tuner: String
    var tuneNotes: String

    // Internals notes (free-form for custom build details)
    var internalsNotes: String

    init() {
        self.id = UUID()
        self.updatedAt = Date()
        self.layout = .inline4
        self.displacement = 0
        self.bore = 0
        self.stroke = 0
        self.compressionRatio = 0
        self.blockMaterial = ""
        self.headMaterial = ""
        self.valvesPerCylinder = 4
        self.camshaftType = "DOHC"
        self.aspirationType = .naturallyAspirated
        self.boostPressure = 0
        self.intercooled = false
        self.fuelType = .gasoline
        self.injectionType = "Port"
        self.targetAFR = 14.7
        self.horsepowerAtWheel = 0
        self.horsepowerAtCrank = 0
        self.torqueAtWheel = 0
        self.torqueAtCrank = 0
        self.tuner = ""
        self.tuneNotes = ""
        self.internalsNotes = ""
    }

    var calculatedDisplacement: Double {
        guard bore > 0, stroke > 0 else { return displacement }
        let cylinders = layout.cylinderCount
        return (Double.pi / 4) * pow(bore / 10, 2) * (stroke / 10) * Double(cylinders) / 1000
    }
}

extension EngineLayout {
    var cylinderCount: Int {
        switch self {
        case .inline4, .flat4: return 4
        case .inline5: return 5
        case .inline6, .v6, .flat6: return 6
        case .v8: return 8
        case .v10: return 10
        case .v12: return 12
        case .rotary: return 2
        case .other: return 0
        }
    }
}
