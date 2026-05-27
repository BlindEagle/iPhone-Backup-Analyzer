import SwiftUI
import SwiftData

struct VehicleDetailView: View {
    @Bindable var vehicle: Vehicle
    @Environment(\.modelContext) private var modelContext

    @State private var showingAddMod = false
    @State private var selectedCategory: ModificationCategory? = nil
    @State private var showingEditVehicle = false

    var groupedMods: [(ModificationCategory, [Modification])] {
        let filtered = selectedCategory.map { cat in vehicle.modifications.filter { $0.category == cat } } ?? vehicle.modifications
        let grouped = Dictionary(grouping: filtered, by: \.category)
        return ModificationCategory.allCases.compactMap { cat in
            guard let mods = grouped[cat], !mods.isEmpty else { return nil }
            return (cat, mods)
        }
    }

    var totalSpend: Double { vehicle.modifications.filter { $0.status == .installed }.reduce(0) { $0 + $1.cost } }

    var body: some View {
        List {
            // Stats header
            Section {
                HStack(spacing: 0) {
                    StatTile(value: "\(vehicle.modifications.count)", label: "Total Mods")
                    Divider()
                    StatTile(value: "\(vehicle.modifications.filter { $0.status == .installed }.count)", label: "Installed")
                    Divider()
                    StatTile(value: totalSpend > 0 ? "$\(Int(totalSpend).formatted())" : "--", label: "Spent")
                }
                .frame(maxWidth: .infinity)
            }

            // Engine Blueprint
            Section("Engine Blueprint") {
                if let blueprint = vehicle.engineBlueprint {
                    NavigationLink(destination: EngineBlueprintView(vehicle: vehicle, blueprint: blueprint)) {
                        BlueprintRowView(blueprint: blueprint)
                    }
                } else {
                    Button {
                        let bp = EngineBlueprint()
                        vehicle.engineBlueprint = bp
                        modelContext.insert(bp)
                    } label: {
                        Label("Create Engine Blueprint", systemImage: "plus.circle")
                    }
                }
            }

            // Category filter chips
            if !vehicle.modifications.isEmpty {
                Section {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack {
                            FilterChip(label: "All", isSelected: selectedCategory == nil) {
                                selectedCategory = nil
                            }
                            ForEach(ModificationCategory.allCases, id: \.self) { cat in
                                if vehicle.modifications.contains(where: { $0.category == cat }) {
                                    FilterChip(label: cat.rawValue, isSelected: selectedCategory == cat) {
                                        selectedCategory = selectedCategory == cat ? nil : cat
                                    }
                                }
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }
                .listRowInsets(EdgeInsets(top: 0, leading: 12, bottom: 0, trailing: 12))
            }

            // Modifications grouped by category
            ForEach(groupedMods, id: \.0) { (category, mods) in
                Section(category.rawValue) {
                    ForEach(mods) { mod in
                        NavigationLink(destination: ModificationDetailView(mod: mod)) {
                            ModRowView(mod: mod)
                        }
                    }
                    .onDelete { offsets in
                        for i in offsets { modelContext.delete(mods[i]) }
                    }
                }
            }

            if vehicle.modifications.isEmpty {
                Section {
                    ContentUnavailableView("No Modifications", systemImage: "wrench.and.screwdriver",
                        description: Text("Tap + to log your first modification."))
                        .padding()
                }
                .listRowBackground(Color.clear)
            }
        }
        .navigationTitle(vehicle.displayName)
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                HStack {
                    Button { showingEditVehicle = true } label: {
                        Image(systemName: "square.and.pencil")
                    }
                    Button { showingAddMod = true } label: {
                        Image(systemName: "plus")
                    }
                }
            }
        }
        .sheet(isPresented: $showingAddMod) {
            AddModificationView(vehicle: vehicle)
        }
        .sheet(isPresented: $showingEditVehicle) {
            EditVehicleView(vehicle: vehicle)
        }
    }
}

struct StatTile: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 2) {
            Text(value).font(.title2.bold())
            Text(label).font(.caption2).foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
    }
}

struct FilterChip: View {
    let label: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.caption)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? Color.accentColor : Color.secondary.opacity(0.15))
                .foregroundStyle(isSelected ? .white : .primary)
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
}

struct BlueprintRowView: View {
    let blueprint: EngineBlueprint

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "engine.combustion.fill")
                .font(.title2)
                .foregroundStyle(Color.orange)
                .frame(width: 32)
            VStack(alignment: .leading, spacing: 3) {
                Text("\(blueprint.layout.rawValue)")
                    .font(.headline)
                HStack(spacing: 8) {
                    if blueprint.displacement > 0 {
                        Text(String(format: "%.1fL", blueprint.displacement))
                            .font(.caption).foregroundStyle(.secondary)
                    }
                    Text(blueprint.aspirationType.rawValue)
                        .font(.caption).foregroundStyle(.secondary)
                    if blueprint.horsepowerAtWheel > 0 {
                        Text("\(Int(blueprint.horsepowerAtWheel)) whp")
                            .font(.caption).foregroundStyle(.orange)
                    }
                }
            }
        }
        .padding(.vertical, 2)
    }
}

struct ModRowView: View {
    let mod: Modification

    var statusColor: Color {
        switch mod.status {
        case .planned: return .gray
        case .purchased: return .blue
        case .installed: return .green
        case .removed: return .red
        }
    }

    var body: some View {
        HStack(spacing: 12) {
            Circle()
                .fill(statusColor)
                .frame(width: 8, height: 8)
            VStack(alignment: .leading, spacing: 2) {
                Text(mod.name).font(.body)
                HStack {
                    if !mod.brand.isEmpty {
                        Text(mod.brand).font(.caption).foregroundStyle(.secondary)
                    }
                    Spacer()
                    Text(mod.status.rawValue)
                        .font(.caption)
                        .foregroundStyle(statusColor)
                }
            }
            if mod.cost > 0 {
                Text("$\(Int(mod.cost))")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
    }
}
