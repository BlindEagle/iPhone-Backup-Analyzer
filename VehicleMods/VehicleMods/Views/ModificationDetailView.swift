import SwiftUI

struct ModificationDetailView: View {
    @Bindable var mod: Modification
    @State private var isEditing = false

    var body: some View {
        List {
            Section("Part Info") {
                LabeledContent("Name", value: mod.name)
                if !mod.brand.isEmpty { LabeledContent("Brand", value: mod.brand) }
                if !mod.partNumber.isEmpty { LabeledContent("Part #", value: mod.partNumber) }
                LabeledContent("Category", value: mod.category.rawValue)
            }
            Section("Status") {
                HStack {
                    Text("Status")
                    Spacer()
                    Text(mod.status.rawValue)
                        .foregroundStyle(statusColor)
                        .fontWeight(.medium)
                }
                if let date = mod.installDate {
                    LabeledContent("Install Date", value: date.formatted(date: .long, time: .omitted))
                }
                if mod.cost > 0 {
                    LabeledContent("Cost", value: mod.cost, format: .currency(code: "USD"))
                }
            }
            if !mod.notes.isEmpty {
                Section("Notes") {
                    Text(mod.notes)
                        .foregroundStyle(.secondary)
                }
            }
            Section("Metadata") {
                LabeledContent("Added", value: mod.createdAt.formatted(date: .abbreviated, time: .shortened))
            }
        }
        .navigationTitle(mod.name)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button("Edit") { isEditing = true }
            }
        }
        .sheet(isPresented: $isEditing) {
            EditModificationView(mod: mod)
        }
    }

    var statusColor: Color {
        switch mod.status {
        case .planned: return .gray
        case .purchased: return .blue
        case .installed: return .green
        case .removed: return .red
        }
    }
}
