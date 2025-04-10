# Client Development Tasks

## Week 1 (Jan 1-5, 2025)

Map Visualization Core Features:

- [x] Implement raster layer loading and display
- [x] Add styling for raster layer visualization
- [x] Enable dynamic layer updates based on time selection
- [x] Implement PM2.5 to AQI Index conversion scripts
- [x] Set up shape file serving functionality
- [x] Organize and display layers in logical groups

## Week 2 (Jan 6-12, 2025)

User Interface & Authentication:

- [x] Search functionality
    - [x] Handle duplicate district names in Vietnam
- [x] Air Quality Index (AQI) charting
- [x] Warning tab information cards
- [x] Display AQI monitoring station markers
- [x] User authentication system (login/signup)

## Week 3 (Jan 13-19, 2025)

Rankings & User Settings:

- [x] District/Province AQI ranking system
- [x] User preferences management
    - [x] Notification configuration
    - [x] User profile management
    - [x] Additional settings

## Week 4 (Jan 21-26, 2025)

Data Integration & Automation:

- [x] Fix duplicate labels of TiledWMS
- [x] Implement notification system
- [x] Integrate monitoring station data from GeoServer
- [x] Configure automated daily data collection
- [x] Set up data crawler for moitruongthudo.vn

## Week 5 (Feb 10-16, 2025)

Data Integration & Feature Toggle

- [x] Turn on/off visibility of layers
- [x] Fill data of stations layer to warning tab

## Week 6 (Mar 3-9, 2025)

UI/UX Improvements & Feature Completion:

- [x] Re-design the homepage layout
- [ ] Complete core features:
    - [x] Implement signout functionality
    - [ ] Integrate wind data collection
    - [ ] Configure cronjob for real-time station data updates
    - [ ] Add multi-language support (Vietnamese/English)
    - [ ] Implement notification preference system
    - [ ] Create favorite locations feature
    - [x] Enhance ranking board visualization
    - [x] Search Bar for each tab
    - [ ] Return button for analytics page
    - [ ] Change Sign in/Sign out to a modal
    - [x] Data of current location
    - [x] Delete Alert
    - [x] Add Custom Alert
    - [ ] Export Excel Data Analytics page
    - [x] Create alert by user location
        - [x] Guidance
        - [x] Access user location
        - [x] Register Form
        - [x] Test
    - [x] Signin Notification

## Week 7 (Mar 10-16, 2025)

- [ ] Complete core features:

    - [x] Integrate wind data collection
    - [x] Configure cronjob for real-time station data updates
    - [ ] Add multi-language support (Vietnamese/English)
    - [ ] Implement notification preference system
    - [ ] Create favorite locations feature
    - [ ] Return button for analytics page
    - [ ] Change Sign in/Sign out to a modal
    - [ ] Export Excel Data Analytics page
    - [x] Update user profile
    - [ ] Weather Card data
    - [ ] Pm2.5 data geoserver
    - [ ] Fix Email
    - [ ] https://nomads.ncep.noaa.gov/gribfilter.php?ds=gfs_0p25_1hr -> cronjob
    - [x] Get wind data by cycle (nearest cycle available)
    - [x] Trang quản lý pipeline: Force rerun, check cronjob nào hoàn thành, ... (Quản lý dữ liệu indra.eweather.gov.vn)
    - [x] near real-time aqi
