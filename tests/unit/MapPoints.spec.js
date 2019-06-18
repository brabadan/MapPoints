import {shallowMount} from '@vue/test-utils'
import MapPoints from '@/components/MapPoints.vue'

const placemark = class {
    events = {add: jest.fn()};
    geometry = {_coordinates: [0, 0]};
};

describe('MapPoints.vue', () => {
    let wrapper;

    beforeEach((() => {
        wrapper = shallowMount(MapPoints);
        // Mocking object 'ymaps'
        var ymaps = window.ymaps = {
            Placemark: placemark,
            Polyline: class {
            }
        };
        // Mocking 'map' object
        wrapper.setData({map: {getCenter: jest.fn(), geoObjects: {add: jest.fn(), remove: jest.fn()}}});
    }));

    test('not renders text after initialization', () => {
        expect(wrapper.text()).toMatch('');
    });

    test('method addPoint properly add new point and renders newPointName in points list', () => {
        const newPointName = 'Новая точка маршрута';

        wrapper.vm.addPoint(newPointName);

        expect(wrapper.text()).toMatch(newPointName);
        expect(wrapper.vm.points.length).toBe(1);
        expect(wrapper.vm.points[0].name).toBe(newPointName);

    });

    test('method removePoint properly remove element from "points" array ', () => {
        wrapper.setData({points: [{placemark: new placemark()}, {placemark: new placemark()}]});

        wrapper.vm.removePoint(1);

        expect(wrapper.vm.points.length).toBe(1);
    })

});
