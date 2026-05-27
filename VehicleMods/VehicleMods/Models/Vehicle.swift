import Foundation
import SwiftData

@Model
final class Vehicle {
    var id: UUID
    var year: Int
    var make: String
    var model: String
    var trim: String
    var vin: String
    var notes: String
    var createdAt: Date

    @Relationship(deleteRule: .cascade)
    var modifications: [Modification]

    @Relationship(deleteRule: .cascade)
    var engineBlueprint: EngineBlueprint?

    init(year: Int, make: String, model: String, trim: String = "", vin: String = "", notes: String = "") {
        self.id = UUID()
        self.year = year
        self.make = make
        self.model = model
        self.trim = trim
        self.vin = vin
        self.notes = notes
        self.createdAt = Date()
        self.modifications = []
    }

    var displayName: String { "\(year) \(make) \(model)" }
}
