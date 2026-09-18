// form_8949_2025.js
// Interactive calculations for Form 8949 (2025).
// This script is intentionally scoped to #form8949 so it can coexist
// with the rest of the tax application's navigation and forms.

(() => {
    const form = document.querySelector("#form8949");

    if (!form) {
        return;
    }

    function numberValue(input) {
        const value = parseFloat(input?.value);
        return Number.isFinite(value) ? value : 0;
    }

    function calculatePage(pagePrefix) {
        const rows = form.querySelectorAll(
            `.f8949-entry-row input[name^="${pagePrefix}"]`
        );

        const rowNumbers = new Set();

        rows.forEach(input => {
            const match = input.name.match(
                new RegExp(`^${pagePrefix}(\\d+)_`)
            );

            if (match) {
                rowNumbers.add(match[1]);
            }
        });

        let totalD = 0;
        let totalE = 0;
        let totalG = 0;
        let totalH = 0;

        rowNumbers.forEach(rowNumber => {
            const d = form.querySelector(
                `[name="${pagePrefix}${rowNumber}_d"]`
            );
            const e = form.querySelector(
                `[name="${pagePrefix}${rowNumber}_e"]`
            );
            const g = form.querySelector(
                `[name="${pagePrefix}${rowNumber}_g"]`
            );
            const h = form.querySelector(
                `[name="${pagePrefix}${rowNumber}_h"]`
            );

            const hasAnyAmount =
                d?.value !== "" ||
                e?.value !== "" ||
                g?.value !== "";

            const dValue = numberValue(d);
            const eValue = numberValue(e);
            const gValue = numberValue(g);

            if (hasAnyAmount && h) {
                // Form 8949 column (h):
                // subtract column (e) from column (d),
                // then combine with column (g).
                h.value = (dValue - eValue + gValue).toFixed(2);
            } else if (h) {
                h.value = "";
            }

            totalD += dValue;
            totalE += eValue;
            totalG += gValue;
            totalH += hasAnyAmount ? dValue - eValue + gValue : 0;
        });

        const totalDInput = form.querySelector(
            `[name="${pagePrefix}TotalD"]`
        );
        const totalEInput = form.querySelector(
            `[name="${pagePrefix}TotalE"]`
        );
        const totalGInput = form.querySelector(
            `[name="${pagePrefix}TotalG"]`
        );
        const totalHInput = form.querySelector(
            `[name="${pagePrefix}TotalH"]`
        );

        if (totalDInput) totalDInput.value = totalD ? totalD.toFixed(2) : "";
        if (totalEInput) totalEInput.value = totalE ? totalE.toFixed(2) : "";
        if (totalGInput) totalGInput.value = totalG ? totalG.toFixed(2) : "";
        if (totalHInput) totalHInput.value = totalH ? totalH.toFixed(2) : "";
    }

    function calculateAll() {
        calculatePage("short");
        calculatePage("long");
    }

    form.addEventListener("input", event => {
        if (event.target.matches("input")) {
            calculateAll();
        }
    });

    calculateAll();
})();
