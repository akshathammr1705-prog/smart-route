/**
 * SMART ROUTE OPTIMIZER - FIXED VERSION
 */

const CONFIG = {
    vehicles: {
        sedan: { name: 'Sedan', consumption: 7.5 },
        suv: { name: 'SUV', consumption: 10.2 },
        truck: { name: 'Truck', consumption: 14.5 },
        hybrid: { name: 'Hybrid', consumption: 4.8 }
    }
};

const State = {
    currentVehicle: 'sedan',
    fuelPrice: 4.25,
    waypoints: [
        { id: '1', type: 'start', address: 'Start' },
        { id: '2', type: 'end', address: 'Destination' }
    ],
    routes: {}
};

// ================= UI =================

const App = {

    init() {
        this.renderVehicles();
        this.renderWaypoints();
        this.renderRoutes();
    },

    // VEHICLES
    renderVehicles() {
        const container = document.getElementById('vehicleGrid');
        if (!container) return;

        container.innerHTML = Object.entries(CONFIG.vehicles).map(([key, v]) => `
            <div class="vehicle-card ${State.currentVehicle === key ? 'selected' : ''}" 
                onclick="App.selectVehicle('${key}')">
                <b>${v.name}</b><br>
                ${v.consumption} L/100km
            </div>
        `).join('');
    },

    selectVehicle(key) {
        State.currentVehicle = key;
        this.renderVehicles();
    },

    // WAYPOINTS
    renderWaypoints() {
        const container = document.getElementById('waypoints');
        if (!container) return;

        container.innerHTML = State.waypoints.map((wp, i) => `
            <div class="flex mb-2">
                <input value="${wp.address}" 
                    onchange="App.updateWaypoint('${wp.id}', this.value)"
                    class="border p-2 flex-1">
                ${wp.type !== 'start' && wp.type !== 'end' ? 
                    `<button onclick="App.removeWaypoint('${wp.id}')">❌</button>` : ''}
            </div>
        `).join('');
    },

    addWaypoint() {
        State.waypoints.splice(State.waypoints.length - 1, 0, {
            id: Date.now().toString(),
            type: 'stop',
            address: ''
        });
        this.renderWaypoints();
    },

    updateWaypoint(id, value) {
        const wp = State.waypoints.find(w => w.id === id);
        if (wp) wp.address = value;
    },

    removeWaypoint(id) {
        State.waypoints = State.waypoints.filter(w => w.id !== id);
        this.renderWaypoints();
    },

    // ROUTES
    calculateRoute() {
        const vehicle = CONFIG.vehicles[State.currentVehicle];
        const distance = Math.random() * 50 + 10;

        const fuel = (distance / 100) * vehicle.consumption;
        const cost = fuel * State.fuelPrice;

        State.routes = {
            eco: { distance, cost: cost * 0.9 },
            fast: { distance: distance + 5, cost: cost * 1.2 },
            short: { distance: distance - 3, cost: cost }
        };

        this.renderRoutes();
    },

    renderRoutes() {
        const container = document.getElementById('routeOptions');
        if (!container) return;

        container.innerHTML = Object.entries(State.routes).map(([key, r]) => `
            <div class="route-option" onclick="App.selectRoute('${key}')">
                <b>${key.toUpperCase()}</b><br>
                Distance: ${r.distance.toFixed(1)} km<br>
                Cost: $${r.cost.toFixed(2)}
            </div>
        `).join('');
    },

    selectRoute(key) {
        document.querySelectorAll('.route-option')
            .forEach(el => el.classList.remove('active'));

        event.target.closest('.route-option').classList.add('active');
    }
};

// INIT
window.onload = () => App.init();
