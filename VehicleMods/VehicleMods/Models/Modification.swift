import Foundation
import SwiftData

enum ModificationCategory: String, Codable, CaseIterable {
    case engine = "Engine"
    case suspension = "Suspension"
    case brakes = "Brakes"
    case exhaust = "Exhaust"
    case intake = "Intake"
    case transmission = "Transmission"
    case wheels = "Wheels & Tires"
    case exterior = "Exterior"
    case interior = "Interior"
    case electronics = "Electronics"
    case fueling = "Fueling"
    case forced = "Forced Induction"
    case other = "Other"

    var systemImage: String {
        switch self {
        case .engine: return "engine.combustion"
        case .suspension: return "car.side.and.exclamationmark"
        case .brakes: return "brake.signal"
        case .exhaust: return "arrow.up.right.and.arrow.down.left"
        case .intake: return "wind"
        case .transmission: return "gear.badge"
        case .wheels: return "circle.dashed"
        case .exterior: return "car"
        case .interior: return "seat.passenger"
        case .electronics: return "bolt.car"
        case .fueling: return "fuelpump"
        case .forced: return "arrow.up.circle"
        case .other: return "wrench.and.screwdriver"
        }
    }
}

enum ModificationStatus: String, Codable, CaseIterable {
    case planned = "Planned"
    case purchased = "Purchased"
    case installed = "Installed"
    case removed = "Removed"
}

@Model
final class Modification {
    var id: UUID
    var name: String
    var brand: String
    var partNumber: String
    var category: ModificationCategory
    var status: ModificationStatus
    var installDate: Date?
    var cost: Double
    var notes: String
    var createdAt: Date

    init(name: String, brand: String = "", partNumber: String = "",
         category: ModificationCategory = .other,
         status: ModificationStatus = .planned,
         installDate: Date? = nil, cost: Double = 0, notes: String = "") {
        self.id = UUID()
        self.name = name
        self.brand = brand
        self.partNumber = partNumber
        self.category = category
        self.status = status
        self.installDate = installDate
        self.cost = cost
        self.notes = notes
        self.createdAt = Date()
    }
}
