export function init() {
    const fromVal = document.getElementById('from-value');
    const toVal = document.getElementById('to-value');
    const fromUnit = document.getElementById('from-unit');
    const toUnit = document.getElementById('to-unit');

    const path = window.location.pathname;
    let units = { 'Base': 1 };

    if (path.includes('length')) {
        units = {
            'Meter (m)': 1,
            'Kilometer (km)': 1000,
            'Centimeter (cm)': 0.01,
            'Millimeter (mm)': 0.001,
            'Mile (mi)': 1609.344,
            'Yard (yd)': 0.9144,
            'Foot (ft)': 0.3048,
            'Inch (in)': 0.0254
        };
    } else if (path.includes('weight')) {
        units = {
            'Gram (g)': 1,
            'Kilogram (kg)': 1000,
            'Milligram (mg)': 0.001,
            'Pound (lb)': 453.59237,
            'Ounce (oz)': 28.34952
        };
    } else if (path.includes('area')) {
        units = {
            'Square Meter (m²)': 1,
            'Square Kilometer (km²)': 1000000,
            'Square Foot (ft²)': 0.092903,
            'Square Inch (in²)': 0.00064516,
            'Square Yard (yd²)': 0.836127,
            'Acre (ac)': 4046.856,
            'Hectare (ha)': 10000,
            'Square Mile (mi²)': 2589988
        };
    } else {
        units = {
            'Base Unit': 1,
            'Multipler (kilo)': 1000,
            'Fraction (milli)': 0.001
        };
    }

    if (!fromUnit) return;

    const cleanOptsSanitized = Object.keys(units).map(k => '<option value="' + units[k] + '">' + k + '</option>').join('');
    fromUnit.innerHTML = cleanOptsSanitized;
    toUnit.innerHTML = cleanOptsSanitized;

    if (toUnit.options.length > 1) {
        toUnit.selectedIndex = 1;
    }

    function calculate() {
        const val = parseFloat(fromVal.value) || 0;
        const fromFactor = parseFloat(fromUnit.value);
        const toFactor = parseFloat(toUnit.value);

        const result = (val * fromFactor) / toFactor;
        toVal.value = result.toFixed(4).replace(/\.0+$/, '');
    }

    fromVal.addEventListener('input', calculate);
    fromUnit.addEventListener('change', calculate);
    toUnit.addEventListener('change', calculate);

    calculate();
}
