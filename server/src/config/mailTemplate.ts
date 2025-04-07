export const alertMailTemplate = (
  location: string,
  exceededDays: string[],
  aqiDays: {
    time: string;
    aqi_index: number;
  }[]
) => {
  const getStatus = (value: number) => {
    if (value <= 50) return "good";
    else if (value <= 100) return "moderate";
    else if (value <= 150) return "unhealthy-sensitive";
    else if (value <= 200) return "unhealthy";
    else if (value <= 300) return "very-unhealthy";
    else return "hazardous";
  };
  let exceedDayList = "";
  let firstAQIList = "";
  let secondAQIList = "";
  exceededDays.forEach((day) => {
    exceedDayList += `<li>${day}</li>`;
  });
  aqiDays.forEach((item, index) => {
    if (index < 4) {
      firstAQIList += `<div class="day-item">
							<span class="day-label">${item.time}</span>
							<div class="aqi-value ${getStatus(item.aqi_index)}">${item.aqi_index}</div>
				</div>`;
    } else {
      secondAQIList += `<div class="day-item">
		<span class="day-label">${item.time}</span>
		<div class="aqi-value ${getStatus(item.aqi_index)}">${item.aqi_index}</div>
</div>`;
    }
  });
  return `
<!DOCTYPE html>
<html lang="vi">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Thẻ Thông Tin Cảnh Báo</title>
		<style>
			* {
				box-sizing: border-box;
				margin: 0;
				padding: 0;
				font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
					'Helvetica Neue', Arial, sans-serif;
			}

			body {
				display: flex;
				justify-content: center;
				align-items: center;
				min-width: 100vw;
				width: 100%;
				min-height: 100vh;
				background-color: #f0f2f5;
				padding: 12px;
			}

			.card {
				width: 30rem;
				background-color: #fff;
				border-radius: 8px;
				margin: 0 auto;
				box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
				padding: 16px;
			}

			.title {
				font-size: 15px;
				font-weight: 600;
				color: #202020;
				margin-bottom: 10px;
			}

			.notice-container {
				background-color: #fee2e2;
				border-left: 4px solid #ef4444;
				padding: 12px;
				margin-bottom: 14px;
				border-radius: 4px;
			}

			.notice-text {
				color: #b91c1c;
				font-size: 13px;
				line-height: 1.4;
				font-weight: 500;
			}

			.notice-text ul {
				margin-top: 6px;
				padding-left: 18px;
			}

			.notice-text li {
				margin-bottom: 3px;
				position: relative;
			}

			.notice-text li:before {
				content: '•';
				color: #ef4444;
				font-weight: bold;
				display: inline-block;
				width: 1em;
				margin-left: -1em;
			}

			.notice-text .alert-heading {
				font-weight: 600;
				margin-bottom: 4px;
				font-size: 14px;
			}

			.weather-container {
				display: flex;
				width: 100%;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
			}

			.temp-info {
				display: flex;
				height: 100%;
				flex-direction: column;
			}

			.current-temp {
				font-size: 36px;
				font-weight: 700;
				color: #1f2937;
			}

			.wind-info {
				margin-top: 4px;
				font-size: 14px;
				color: #4b5563;
			}

			.weather-details {
				display: flex;
				height: 100%;
				flex-direction: column;
				align-items: center;
			}

			.cloud-icon {
				width: auto;
				height: 32px;
				margin-bottom: 4px;
				color: #3b82f6;
				position: relative;
			}

			.cloud-icon:before {
				content: '';
				position: absolute;
				background: #3b82f6;
				border-radius: 50%;
				width: 18px;
				height: 18px;
				top: 4px;
				left: 2px;
			}

			.cloud-icon:after {
				content: '';
				position: absolute;
				background: #3b82f6;
				border-radius: 8px;
				width: 28px;
				height: 12px;
				bottom: 6px;
				left: 2px;
			}

			.weather-condition {
				font-size: 14px;
				font-weight: 500;
			}

			.temp-range {
				margin-top: 4px;
				display: flex;
				flex-direction: row;
				gap: 8px;
			}

			.temp-high {
				font-size: 12px;
				color: #f59e0b;
			}

			.temp-low {
				font-size: 12px;
				color: #60a5fa;
			}

			.divider {
				margin-top: 14px;
				width: 100%;
				border-top: 1px solid #e5e7eb;
				padding-top: 10px;
			}

			.aqi-title {
				font-size: 14px;
				font-weight: 600;
				color: #4b5563;
				text-align: center;
				margin-bottom: 8px;
			}

			.aqi-container {
				overflow-x: hidden;
				width: 100%;
			}

			.aqi-days {
				display: table;
				width: 100%;
				table-layout: fixed;
				border-collapse: separate;
				border-spacing: 4px;
				margin: 0 auto; /* Center the table */
			}

			.aqi-days-row {
				display: table-row;
				text-align: center; /* Center the row content */
			}

			.day-item {
				display: table-cell;
				vertical-align: top;
				text-align: center; /* Center the cell content */
				width: 25%;
				padding: 3px;
			}

			.day-label {
				margin-bottom: 4px;
				font-size: 11px;
				font-weight: 500;
				color: #4b5563;
				display: block; /* Make this a block element */
				text-align: center; /* Ensure text is centered */
			}

			.aqi-value {
				display: inline-block;
				height: 35px;
				width: 35px;
				font-size: 11px;
				font-weight: 600;
				color: white;
				margin: 0 auto;
				border-radius: 50%;
				line-height: 35px; /* Match the height for vertical centering */
				text-align: center;
			}

			.good {
				background-color: #00e400;
			}

			.moderate {
				background-color: #ffff00;
				color: #000;
			}

			.poor,
			.unhealthy-sensitive {
				background-color: #ff7e00;
			}

			.bad,
			.unhealthy {
				background-color: #ff0000;
			}

			.very-unhealthy {
				background-color: #8f3f97;
			}

			.hazardous {
				background-color: #7e0023;
			}

			.tooltip {
				display: none;
			}

			.aqi-info-table {
				margin-top: 14px;
				width: 100%;
				border-collapse: collapse;
				font-size: 13px;
			}

			.aqi-info-table th {
				background-color: #f3f4f6;
				padding: 6px 4px;
				text-align: left;
				font-weight: 600;
				color: #374151;
				border-bottom: 1px solid #e5e7eb;
				white-space: nowrap;
				position: sticky;
				top: 0;
				z-index: 1;
			}

			.aqi-info-table td {
				padding: 6px 4px;
				border-bottom: 1px solid #e5e7eb;
				color: #4b5563;
			}

			.aqi-info-table td.category {
				max-width: 80px;
				white-space: normal;
				line-height: 1.2;
				text-align: center;
				word-break: break-word;
				hyphens: auto;
			}

			.aqi-info-table tr:last-child td {
				border-bottom: none;
			}

			.aqi-category-indicator {
				display: inline-block;
				width: 10px;
				height: 10px;
				border-radius: 50%;
				margin-right: 4px;
				vertical-align: middle;
			}

			.aqi-range-wrapper {
				display: flex;
				align-items: center;
				white-space: nowrap;
			}
			
			/* Very small screens */
			@media (max-width: 320px) {
				.card {
					padding: 10px;
				}
				
				.day-item {
					padding: 0 2px;
				}
				
				.aqi-value {
					height: 30px;
					width: 30px;
					font-size: 11px;
					line-height: 30px;
				}
				
				.aqi-info-table th,
				.aqi-info-table td {
					padding: 4px 2px;
					font-size: 11px;
				}
			}
		</style>
	</head>
	<body>
		<div class="card">
			<h2 class="title">${location}</h2>
			<div class="notice-container">
				<div class="notice-text">
					<div class="alert-heading">Cảnh báo chất lượng không khí</div>
					Những ngày có chỉ số AQI vượt ngưỡng cho phép:
					<ul>
						${exceedDayList}
					</ul>
				</div>
			</div>
			<div class="divider">
				<p class="aqi-title">Chỉ Số AQI Việt Nam</p>
				<div class="aqi-container">
					<div class="aqi-days" id="aqi-days-container">
						<div class="aqi-days-row">
							${firstAQIList}
						</div>
						<div class="aqi-days-row">
							${secondAQIList}
						</div>
					</div>

					<!-- Bảng Thông Tin AQI -->
					<table class="aqi-info-table">
						<thead>
							<tr>
								<th>Phạm Vi AQI</th>
								<th>Phân Loại</th>
								<th>Tác Động Sức Khỏe</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<div class="aqi-range-wrapper">
										<span class="aqi-category-indicator good"></span>
										0-50
									</div>
								</td>
								<td class="category">Tốt</td>
								<td>
									Chất lượng không khí đạt mức tốt, ô nhiễm không khí hầu như
									không gây nguy hại.
								</td>
							</tr>
							<tr>
								<td>
									<div class="aqi-range-wrapper">
										<span class="aqi-category-indicator moderate"></span>
										51-100
									</div>
								</td>
								<td class="category">Trung bình</td>
								<td>
									Chất lượng không khí chấp nhận được. Tuy nhiên, một số người
									có thể gặp rủi ro, đặc biệt là những người nhạy cảm với ô
									nhiễm không khí.
								</td>
							</tr>
							<tr>
								<td>
									<div class="aqi-range-wrapper">
										<span
											class="aqi-category-indicator unhealthy-sensitive"></span>
										101-150
									</div>
								</td>
								<td class="category">Không tốt cho nhóm nhạy cảm</td>
								<td>
									Các nhóm nhạy cảm có thể gặp phải ảnh hưởng sức khỏe. Công
									chúng nói chung ít có khả năng bị ảnh hưởng.
								</td>
							</tr>
							<tr>
								<td>
									<div class="aqi-range-wrapper">
										<span class="aqi-category-indicator unhealthy"></span>
										151-200
									</div>
								</td>
								<td class="category">Có hại</td>
								<td>
									Một số người trong cộng đồng có thể gặp phải ảnh hưởng sức
									khỏe; các nhóm nhạy cảm có thể chịu tác động nghiêm trọng hơn.
								</td>
							</tr>
							<tr>
								<td>
									<div class="aqi-range-wrapper">
										<span class="aqi-category-indicator very-unhealthy"></span>
										201-300
									</div>
								</td>
								<td class="category">Rất có hại</td>
								<td>
									Cảnh báo sức khỏe: Nguy cơ ảnh hưởng sức khỏe gia tăng đối với
									tất cả mọi người.
								</td>
							</tr>
							<tr>
								<td>
									<div class="aqi-range-wrapper">
										<span class="aqi-category-indicator hazardous"></span>
										301+
									</div>
								</td>
								<td class="category">Nguy hiểm</td>
								<td>
									Cảnh báo khẩn cấp về điều kiện không khí nguy hiểm: Mọi người
									đều có nguy cơ bị ảnh hưởng.
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</body>
</html>
`;
};

export const emailVerificationTemplate = (url: string, email: string) => {
  return `
	<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Xác Nhận Email</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          "Helvetica Neue", Arial, sans-serif;
      }

      body {
        background-color: #f0f2f5;
        padding: 12px;
        width: 100%;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        padding: 24px;
      }

      .logo {
        text-align: center;
        margin-bottom: 20px;
      }

      .logo img {
        max-height: 60px;
        width: auto;
      }

      .header {
        font-size: 24px;
        font-weight: 600;
        color: #202020;
        margin-bottom: 16px;
        text-align: center;
      }

      .welcome {
        font-size: 20px;
        color: #202020;
        margin-bottom: 24px;
        text-align: center;
      }

      .message-container {
        background-color: #f1f5f9;
        border-left: 4px solid #3b82f6;
        padding: 16px;
        margin-bottom: 20px;
        border-radius: 4px;
      }

      .message-text {
        color: #1e3a8a;
        font-size: 14px;
        line-height: 1.5;
      }

      .verification-button {
        display: block;
        text-align: center;
        margin: 24px auto;
      }

      .btn {
        display: inline-block;
        background-color: #3b82f6;
        color: white;
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 6px;
        border: 1px solid #2563eb;
      }

      .instructions {
        color: #4b5563;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 16px;
        text-align: center;
      }

      .divider {
        width: 100%;
        border-top: 1px solid #e5e7eb;
        margin: 24px 0;
      }

      .footer {
				width: 100%;
        font-size: 12px;
        color: #6b7280;
        text-align: start;
        line-height: 1.5;
      }

      .footer p {
        margin-bottom: 8px;
      }

      .contact-info {
        margin-top: 12px;
        text-align: start;
      }

      /* Email-specific fixes */
      table {
        border-spacing: 0;
        border-collapse: collapse;
        width: 100%;
      }

      td {
        padding: 0;
      }

      img {
        border: 0;
        -ms-interpolation-mode: bicubic;
        display: block;
      }

      @media only screen and (max-width: 480px) {
        .email-container {
          padding: 16px;
        }

        .header {
          font-size: 20px;
        }

        .welcome {
          font-size: 18px;
        }
      }
    </style>
  </head>
  <body>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td>
          <div class="email-container">
            <div class="logo">
              <img src="https://www.example.com/logo.svg" alt="Logo" />
            </div>

            <h1 class="header">Xin chào!</h1>

            <p class="welcome">Chào mừng bạn đến với Air Quality</p>

            <div class="message-container">
              <div class="message-text">
                Cảm ơn bạn đã đăng ký tài khoản Air Quality Monitoring System.
                Để hoàn tất quá trình đăng ký, vui lòng xác nhận địa chỉ email
                của bạn: ${email}.
              </div>
            </div>

            <div class="verification-button">
              <a href="${url}" class="btn"
                >Xác Nhận Email</a
              >
            </div>

            <div class="footer">
              <div class="contact-info">
                <p>
                  Để tìm hiểu thêm thông tin và nhận được sự hỗ trợ, hãy liên
                  lạc thông qua địa chỉ email <a href="">airly@gmail.com</a>
                </p>
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>
	`;
};
