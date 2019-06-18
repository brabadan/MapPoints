import {shallowMount} from '@vue/test-utils'
import MapPoints from '@/components/MapPoints.vue'

describe('MapPoints.vue', () => {
    test('renders newPointName in points list', () => {
        const newPointName = 'Новая точка маршрута';

        const wrapper = shallowMount(MapPoints);

        expect(wrapper.text()).toMatch('');

        wrapper.setData({
            points: [{
                placemark: {},
                name: newPointName,
                order: 1
            }]
        });

        expect(wrapper.text()).toMatch(newPointName);

    })
});
