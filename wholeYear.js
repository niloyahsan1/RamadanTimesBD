document.addEventListener("DOMContentLoaded", function () {
	const city = "Dhaka";
	const country = "Bangladesh";
	const now = new Date();
	const month = now.getMonth() + 1;
	const year = now.getFullYear();

	/* --------------- HELPERS --------------- */
	function cleanTime(t) {
		return t.split(" ")[0];
	}

	function to12(t) {
		let [h, m] = t.split(":");
		h = parseInt(h, 10);
		let ap = h >= 12 ? "PM" : "AM";
		h = h % 12 || 12;
		return `${h}:${m} ${ap}`;
	}

	function toBangla(num) {
		const map = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
		return num
			.toString()
			.split("")
			.map((d) => map[d] ?? d)
			.join("");
	}

	function formatBanglaTime(h, m, s) {
		const pad = (num) => num.toString().padStart(2, '0');
		return `${toBangla(pad(h))}:${toBangla(pad(m))}:${toBangla(pad(s))}`;
	}

	function formatBanglaDate(dateStr) {
		const [dd, mm, yyyy] = dateStr.split("-");
		const dateObj = new Date(`${yyyy}-${mm}-${dd}`);

		return dateObj.toLocaleDateString("bn-BD", {
			day: "numeric",
			month: "long",
		});
	}

	/* --------------- SHOW TODAY DATE --------------- */
	const todayDateText = new Date().toLocaleDateString("bn-BD", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const todayDateEl = document.getElementById("todayDate");
	if (todayDateEl) {
		todayDateEl.innerText = todayDateText;
	}

	/* --------------- FETCH CALENDAR --------------- */
	fetch(
		`https://api.aladhan.com/v1/calendarByCity?city=${city}&country=${country}&method=1&school=1&month=${month}&year=${year}`,
	)
		.then((r) => r.json())
		.then((d) => {
			/* --------------- MONTHLY TABLE --------------- */
			let html = "";

			const todayDateNumber = new Date().getDate();

			d.data.forEach((day, i) => {
				let cls;

				if (i < 10) cls = "stage-rahmah";
				else if (i < 20) cls = "stage-maghfirah";
				else cls = "stage-nijat";

				// Check if this is today
				const isToday = i + 1 === todayDateNumber;

				html += `
					<tr class="${cls} ${isToday ? "today-row" : ""}">
						<td>${toBangla(i + 1)}</td>
						<td>${formatBanglaDate(day.date.gregorian.date)}</td>
						<td>${toBangla(to12(cleanTime(day.timings.Fajr)))}</td>
						<td>${toBangla(to12(cleanTime(day.timings.Maghrib)))}</td>
					</tr>
				`;
			});

			document.getElementById("tableBody").innerHTML = html;

			/* --------------- TODAY LOGIC --------------- */
			const todayIndex = todayDateNumber - 1;
			const todayData = d.data[todayIndex].timings;

			const fajr = cleanTime(todayData.Fajr);
			const maghrib = cleanTime(todayData.Maghrib);

			document.getElementById("sehriToday").innerText = toBangla(
				to12(fajr),
			);

			document.getElementById("iftarToday").innerText = toBangla(
				to12(maghrib),
			);

			function updateCountdown() {
				const now = new Date();

				const [fh, fm] = fajr.split(":");
				const sehriTime = new Date();
				sehriTime.setHours(fh, fm, 0, 0);

				const [mh, mm] = maghrib.split(":");
				const iftarTime = new Date();
				iftarTime.setHours(mh, mm, 0, 0);

				let target, label;

				if (now < sehriTime) {
					target = sehriTime;
					label = "সেহরির বাকি সময়";
				} else if (now < iftarTime) {
					target = iftarTime;
					label = "ইফতারের বাকি সময়";
				} else {
					document.getElementById("countdown").innerText =
						"ইফতারের সময় হয়েছে 🌙";
					return;
				}

				const diff = target - now;
				const h = Math.floor(diff / 3600000);
				const m = Math.floor((diff % 3600000) / 60000);
				const s = Math.floor((diff % 60000) / 1000);

				document.getElementById("countdown").innerText =
					`${label}\n${formatBanglaTime(h, m, s)}`;
			}

			updateCountdown();
			setInterval(updateCountdown, 1000);
		});
});
