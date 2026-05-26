import SwiftUI
import SwiftData

struct VehicleListView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \Vehicle.createdAt, order: .reverse) private var vehicles: [Vehicle]

    @State private var showingAddVehicle = false
    @State private var searchText = ""

    var filtered: [Vehicle] {
        if searchText.isEmpty { return vehicles }
        return vehicles.filter {
            $0.make.localizedCaseInsensitiveContains(searchText) ||
            $0.model.localizedCaseInsensitiveContains(searchText) ||
            String($0.year).contains(searchText)
        }
    }

    var body: some View {
        NavigationStack {
            Group {
                if vehicles.isEmpty {
                    ContentUnavailableView("No Vehicles", systemImage: "car.2",
                        description: Text("Tap + to add your first vehicle."))
                } else {
                    List {
                        ForEach(filtered) { vehicle in
                            NavigationLink(destination: VehicleDetailView(vehicle: vehicle)) {
                                VehicleRowView(vehicle: vehicle)
                            }
                        }
                        .onDelete(perform: deleteVehicles)
                    }
                    .searchable(text: $searchText, prompt: "Search vehicles")
                }
            }
            .navigationTitle("My Garage")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { showingAddVehicle = true } label: {
                        Image(systemName: "plus")
                    }
                }
                if !vehicles.isEmpty {
                    ToolbarItem(placement: .navigationBarLeading) {
                        EditButton()
                    }
                }
            }
            .sheet(isPresented: $showingAddVehicle) {
                AddVehicleView()
            }
        }
    }

    private func deleteVehicles(at offsets: IndexSet) {
        for index in offsets {
            modelContext.delete(filtered[index])
        }
    }
}

struct VehicleRowView: View {
    let vehicle: Vehicle

    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 10)
                    .fill(Color.accentColor.opacity(0.15))
                    .frame(width: 50, height: 50)
                Image(systemName: "car.fill")
                    .font(.title2)
                    .foregroundStyle(Color.accentColor)
            }
            VStack(alignment: .leading, spacing: 3) {
                Text(vehicle.displayName)
                    .font(.headline)
                HStack {
                    Label("\(vehicle.modifications.count) mod\(vehicle.modifications.count == 1 ? "" : "s")",
                          systemImage: "wrench.and.screwdriver")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    if vehicle.engineBlueprint != nil {
                        Label("Blueprint", systemImage: "engine.combustion")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
                if !vehicle.trim.isEmpty {
                    Text(vehicle.trim)
                        .font(.caption2)
                        .foregroundStyle(.tertiary)
                }
            }
        }
        .padding(.vertical, 4)
    }
}
