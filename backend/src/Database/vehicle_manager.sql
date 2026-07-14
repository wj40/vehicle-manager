-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Lip 10, 2026 at 02:25 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vehicle_manager`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `brand` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `reg_number` varchar(14) DEFAULT NULL,
  `vin_number` varchar(17) DEFAULT NULL,
  `production_year` int(11) NOT NULL,
  `status` enum('available','service','rented') NOT NULL DEFAULT 'available',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `type`, `brand`, `model`, `reg_number`, `vin_number`, `production_year`, `status`, `created_at`) VALUES
(1, 'car', 'Fiat', '126p', 'WA 00001', 'SUP126P1986000001', 1986, 'available', '2026-07-10 11:03:17'),
(2, 'car', 'Volkswagen', 'Garbus', 'GD 00002', 'VWH1992085400002H', 1992, 'service', '2026-07-10 11:03:17'),
(3, 'car', 'Mercedes', 'W124', 'WX 00003', 'WDB1240331B123456', 1993, 'available', '2026-07-10 11:03:17'),
(4, 'car', 'Opel', 'Kadett', 'SK 00004', 'WOL0BD68N5S123456', 1995, 'rented', '2026-07-10 11:03:17'),
(5, 'car', 'BMW', 'E36', 'PO 00005', 'WBAAC1108B9876543', 1996, 'available', '2026-07-10 11:03:17'),
(6, 'car', 'Audi', '80 B4', 'KR 00006', 'WAUZZZ89ZNA123456', 1994, 'available', '2026-07-10 11:03:17'),
(7, 'car', 'Toyota', 'Corolla E10', 'LU 00007', 'JT2AE38E9S0123456', 1997, 'service', '2026-07-10 11:03:17'),
(8, 'car', 'Honda', 'Accord VI', 'ZR 00008', 'SHH3445GH5A123456', 1998, 'rented', '2026-07-10 11:03:17'),
(9, 'car', 'Ford', 'Escort', 'DW 00009', 'WF0BXXGAJBWZ12345', 1995, 'available', '2026-07-10 11:03:17'),
(10, 'car', 'Peugeot', '406', 'WB 00010', 'VF38BRFZB8L123456', 1999, 'available', '2026-07-10 11:03:17'),
(11, 'car', 'Fiat', 'Punto', 'GD 00011', 'ZFA1760000S123456', 2001, 'rented', '2026-07-10 11:03:17'),
(12, 'car', 'Volkswagen', 'Passat B5', 'SK 00012', 'WVWZZZ3BZ1E123456', 2002, 'available', '2026-07-10 11:03:17'),
(13, 'car', 'Opel', 'Vectra B', 'WA 00013', 'W0L0TGF482S123456', 2000, 'service', '2026-07-10 11:03:17'),
(14, 'car', 'BMW', 'E46', 'PO 00014', 'WBAEV51010K123456', 2003, 'available', '2026-07-10 11:03:17'),
(15, 'car', 'Mercedes', 'W203', 'KR 00015', 'WDB2030421A123456', 2004, 'available', '2026-07-10 11:03:17'),
(16, 'car', 'Audi', 'A6 C5', 'LU 00016', 'WAUZZZ4BZWN123456', 2005, 'rented', '2026-07-10 11:03:17'),
(17, 'car', 'Renault', 'Megane II', 'ZR 00017', 'VF1LM0B0H36123456', 2004, 'available', '2026-07-10 11:03:17'),
(18, 'car', 'Toyota', 'Avensis', 'DW 00018', 'JT2DE12E3S0123456', 2006, 'service', '2026-07-10 11:03:17'),
(19, 'car', 'Honda', 'Civic VIII', 'WB 00019', 'SHHFK23608U123456', 2007, 'available', '2026-07-10 11:03:17'),
(20, 'car', 'Mazda', '6', 'WX 00020', 'JM0GH10F180123456', 2008, 'rented', '2026-07-10 11:03:17'),
(21, 'car', 'Volkswagen', 'Golf VI', 'GD 00021', 'WVWZZZ1KZ9W123456', 2009, 'available', '2026-07-10 11:03:17'),
(22, 'car', 'Opel', 'Insignia', 'SK 00022', 'W0L0AH68X9S123456', 2010, 'available', '2026-07-10 11:03:17'),
(23, 'car', 'BMW', 'E90', 'PO 00023', 'WBAUD31000P123456', 2009, 'service', '2026-07-10 11:03:17'),
(24, 'car', 'Mercedes', 'W212', 'KR 00024', 'WDD2122001A123456', 2011, 'available', '2026-07-10 11:03:17'),
(25, 'car', 'Audi', 'A4 B8', 'LU 00025', 'WAUZZZ8K6BA123456', 2010, 'rented', '2026-07-10 11:03:17'),
(26, 'car', 'Ford', 'Mondeo IV', 'ZR 00026', 'WF0UXXGAJU5A12345', 2012, 'available', '2026-07-10 11:03:17'),
(27, 'car', 'Toyota', 'Camry XV50', 'DW 00027', 'JT2BF22K5S0123456', 2013, 'available', '2026-07-10 11:03:17'),
(28, 'car', 'Skoda', 'Octavia III', 'WB 00028', 'TMBJJ7NE3F0123456', 2014, 'service', '2026-07-10 11:03:17'),
(29, 'car', 'Hyundai', 'i30', 'WX 00029', 'TMAFK51DAFJ123456', 2015, 'available', '2026-07-10 11:03:17'),
(30, 'car', 'Kia', 'Ceed', 'GD 00030', 'U5YPB81EBGZ123456', 2016, 'rented', '2026-07-10 11:03:17'),
(31, 'car', 'Volkswagen', 'Passat B8', 'SK 00031', 'WVWZZZ3CZGE123456', 2017, 'available', '2026-07-10 11:03:17'),
(32, 'car', 'Opel', 'Astra K', 'PO 00032', 'W0L0XCF688P123456', 2018, 'available', '2026-07-10 11:03:17'),
(33, 'car', 'BMW', 'G30', 'KR 00033', 'WBAJA51050K123456', 2019, 'service', '2026-07-10 11:03:17'),
(34, 'car', 'Mercedes', 'W205', 'LU 00034', 'WDD2050421A123456', 2020, 'available', '2026-07-10 11:03:17'),
(35, 'car', 'Audi', 'A4 B9', 'ZR 00035', 'WAUZZZ8K6NA123456', 2021, 'rented', '2026-07-10 11:03:17'),
(36, 'car', 'Toyota', 'Corolla E210', 'DW 00036', 'JT2AE38E9S0123456', 2022, 'available', '2026-07-10 11:03:17'),
(37, 'car', 'Tesla', 'Model 3', 'WB 00037', '5YJ3E1EA7PF123456', 2023, 'available', '2026-07-10 11:03:17'),
(38, 'car', 'Volkswagen', 'ID.4', 'WX 00038', 'WVWZZZ1KZ0P123456', 2024, 'available', '2026-07-10 11:03:17'),
(39, 'car', 'BMW', 'i4', 'GD 00039', 'WBAJV51050K123456', 2024, 'rented', '2026-07-10 11:03:17'),
(40, 'car', 'Mercedes', 'W214', 'SK 00040', 'WDD2140421A123456', 2023, 'available', '2026-07-10 11:03:17'),
(41, 'truck', 'Renault', 'Master', 'PO 00041', 'VF6XXXXGXHGA12345', 2019, 'available', '2026-07-10 11:03:17'),
(42, 'truck', 'Mercedes', 'Atego', 'KR 00042', 'WDB9700321K123456', 2021, 'available', '2026-07-10 11:03:17'),
(43, 'truck', 'MAN', 'TGX', 'LU 00043', 'WMA06XZZZMP123456', 2022, 'service', '2026-07-10 11:03:17'),
(44, 'truck', 'Scania', 'R460', 'ZR 00044', 'YS2R6X200BZ123456', 2023, 'rented', '2026-07-10 11:03:17'),
(45, 'truck', 'Volvo', 'FH', 'DW 00045', 'YV2AS02A67A123456', 2020, 'available', '2026-07-10 11:03:17'),
(46, 'truck', 'DAF', 'XF', 'WB 00046', 'XLRTE47MS0E123456', 2021, 'available', '2026-07-10 11:03:17'),
(47, 'truck', 'Iveco', 'Stralis', 'WX 00047', 'ZCFC67A000D123456', 2018, 'service', '2026-07-10 11:03:17'),
(48, 'truck', 'Ford', 'Transit', 'GD 00048', 'WF0XXXTTGXGA12345', 2020, 'available', '2026-07-10 11:03:17'),
(49, 'truck', 'Volkswagen', 'Crafter', 'SK 00049', 'WV2ZZZ2EZJH123456', 2022, 'rented', '2026-07-10 11:03:17'),
(50, 'truck', 'Mercedes', 'Sprinter', 'PO 00050', 'WDB9066331S123456', 2024, 'available', '2026-07-10 11:03:17'),
(51, 'motorcycle', 'Yamaha', 'YZF-R1', 'KR 00051', 'JYARN28E0JA123456', 2023, 'available', '2026-07-10 11:03:17'),
(52, 'motorcycle', 'Honda', 'CBR 1000R', 'LU 00052', 'JH2SC1800BK123456', 2022, 'rented', '2026-07-10 11:03:17'),
(53, 'motorcycle', 'Kawasaki', 'Z900', 'ZR 00053', 'JKAZR9001SA123456', 2021, 'available', '2026-07-10 11:03:17'),
(54, 'motorcycle', 'Suzuki', 'GSX-R750', 'DW 00054', 'JS1B7T137D7123456', 2023, 'service', '2026-07-10 11:03:17'),
(55, 'motorcycle', 'Ducati', 'Panigale V2', 'WB 00055', 'ZDMH400AAMB123456', 2024, 'available', '2026-07-10 11:03:17'),
(56, 'motorcycle', 'BMW', 'R 1250 GS', 'WX 00056', 'WB10300A03ZC12345', 2020, 'available', '2026-07-10 11:03:17'),
(57, 'motorcycle', 'KTM', '890 Adventure', 'GD 00057', 'VBKVS4405MM123456', 2022, 'rented', '2026-07-10 11:03:17'),
(58, 'motorcycle', 'Harley-Davidson', 'Iron 883', 'SK 00058', '1HD1LBV12DY123456', 2019, 'available', '2026-07-10 11:03:17'),
(59, 'motorcycle', 'Triumph', 'Street Triple', 'PO 00059', 'SMTD12AM8MJ123456', 2023, 'available', '2026-07-10 11:03:17'),
(60, 'motorcycle', 'Yamaha', 'MT-09', 'KR 00060', 'JYARN28E0LA123456', 2021, 'service', '2026-07-10 11:03:17'),
(61, 'bus', 'Mercedes', 'Citaro G', 'LU 00061', 'WEB62804213245678', 2023, 'available', '2026-07-10 11:03:17'),
(62, 'bus', 'Solaris', 'Urbino 18', 'ZR 00062', 'SUU241064CN123456', 2022, 'available', '2026-07-10 11:03:17'),
(63, 'bus', 'MAN', 'Lions City E', 'DW 00063', 'WMA227ZZZHP123456', 2024, 'available', '2026-07-10 11:03:17'),
(64, 'bus', 'Iveco', 'Urbanway', 'WB 00064', 'ZCFC65A000E123456', 2021, 'rented', '2026-07-10 11:03:17'),
(65, 'bus', 'Volvo', '7900', 'WX 00065', 'YV3S2R220BA123456', 2020, 'service', '2026-07-10 11:03:17'),
(66, 'bus', 'Scania', 'Citywide', 'GD 00066', 'YS2K6X200CZ123456', 2023, 'available', '2026-07-10 11:03:17'),
(67, 'bus', 'Setra', 'S 416', 'SK 00067', 'WKK4180032P123456', 2022, 'available', '2026-07-10 11:03:17'),
(68, 'bus', 'Neoplan', 'Tourliner', 'PO 00068', 'WAGP2R2205A123456', 2019, 'rented', '2026-07-10 11:03:17'),
(69, 'car', 'Mitsubishi', 'Lancer Evo X', 'KR 00069', 'JMBSNCY3A8U123456', 2008, 'rented', '2026-07-10 11:03:17'),
(70, 'car', 'Subaru', 'Impreza WRX', 'LU 00070', 'JF1GDAK86SG123456', 2007, 'service', '2026-07-10 11:03:17'),
(71, 'car', 'Nissan', 'Skyline R34', 'ZR 00071', 'BNR34123456789012', 1999, 'available', '2026-07-10 11:03:17'),
(72, 'car', 'Mazda', 'RX-7 FD', 'DW 00072', 'FD3S1234567890123', 1997, 'rented', '2026-07-10 11:03:17'),
(73, 'car', 'Toyota', 'Supra MK4', 'WB 00073', 'JT2JA82J6S0123456', 1996, 'available', '2026-07-10 11:03:17'),
(74, 'car', 'Ferrari', 'F430', 'WX 00074', 'ZFFEZ58B000123456', 2008, 'available', '2026-07-10 11:03:17'),
(75, 'car', 'Lamborghini', 'Gallardo', 'GD 00075', 'ZHWGE31T39A123456', 2009, 'service', '2026-07-10 11:03:17'),
(76, 'car', 'Porsche', '911 996', 'SK 00076', 'WP0ZZZ99Z1S123456', 2003, 'rented', '2026-07-10 11:03:17'),
(77, 'car', 'Fiat', '125p', 'WA 00101', 'SUP125P1978000000', 1978, 'available', '2026-07-10 11:09:55'),
(78, 'car', 'Polski Fiat', '126p', 'GD 00102', 'SUP126P1982000000', 1982, 'service', '2026-07-10 11:09:55'),
(79, 'car', 'Syrena', '105', 'SK 00103', 'SYR10519800000003', 1980, 'available', '2026-07-10 11:09:55'),
(80, 'car', 'Dacia', '1300', 'PO 00104', 'DAC13001985000004', 1985, 'rented', '2026-07-10 11:09:55'),
(81, 'car', 'Lada', '2105', 'KR 00105', 'LAD21051984000005', 1984, 'available', '2026-07-10 11:09:55'),
(82, 'car', 'Lada', 'Niva', 'LU 00106', 'LAD21211988000006', 1988, 'available', '2026-07-10 11:09:55'),
(83, 'car', 'Zastava', 'Yugo', 'ZR 00107', 'ZAS11001989000007', 1989, 'service', '2026-07-10 11:09:55'),
(84, 'car', 'Wartburg', '353', 'DW 00108', 'WAR35319860000008', 1986, 'rented', '2026-07-10 11:09:55'),
(85, 'car', 'Trabant', '601', 'WB 00109', 'TRA60119870000009', 1987, 'available', '2026-07-10 11:09:55'),
(86, 'car', 'Skoda', 'Favorit', 'WX 00110', 'SKO78119900000110', 1990, 'available', '2026-07-10 11:09:55'),
(87, 'car', 'Volkswagen', 'Golf II', 'GD 00111', 'WVWZZZ1GZGW123456', 1990, 'rented', '2026-07-10 11:09:55'),
(88, 'car', 'Mercedes', 'W201', 'SK 00112', 'WDB2010241A123456', 1991, 'available', '2026-07-10 11:09:55'),
(89, 'car', 'Opel', 'Astra F', 'PO 00113', 'W0L0CBF683S123456', 1992, 'available', '2026-07-10 11:09:55'),
(90, 'car', 'Ford', 'Sierra', 'KR 00114', 'WF0BXXGAJBPZ12345', 1991, 'available', '2026-07-10 11:09:55'),
(91, 'car', 'Renault', 'Clio I', 'LU 00115', 'VF1B05A0512345678', 1992, 'service', '2026-07-10 11:09:55'),
(92, 'car', 'Peugeot', '205', 'ZR 00116', 'VF320AKT6DT123456', 1990, 'rented', '2026-07-10 11:09:55'),
(93, 'car', 'Citroen', 'ZX', 'DW 00117', 'VF7ZX1000SJ123456', 1993, 'available', '2026-07-10 11:09:55'),
(94, 'car', 'Nissan', 'Primera', 'WB 00118', 'JN10AAAA0U0123456', 1992, 'available', '2026-07-10 11:09:55'),
(95, 'car', 'Mazda', '323', 'WX 00119', 'JM0BF10F200123456', 1991, 'service', '2026-07-10 11:09:55'),
(96, 'car', 'Toyota', 'Celica', 'GD 00120', 'JT2AT82J7S0123456', 1994, 'rented', '2026-07-10 11:09:55'),
(97, 'car', 'Honda', 'Prelude', 'SK 00121', 'JHMBB81500C123456', 1993, 'available', '2026-07-10 11:09:55'),
(98, 'car', 'Mitsubishi', 'Galant', 'PO 00122', 'JMBSNCS3A8U123456', 1994, 'available', '2026-07-10 11:09:55'),
(99, 'car', 'BMW', 'E34', 'KR 00123', 'WBAHD11040G123456', 1993, 'available', '2026-07-10 11:09:55'),
(100, 'car', 'Audi', '100 C4', 'LU 00124', 'WAUZZZ4AZN1234567', 1992, 'service', '2026-07-10 11:09:55'),
(101, 'car', 'Volvo', '940', 'ZR 00125', 'YV1940886S1234567', 1995, 'rented', '2026-07-10 11:09:55'),
(102, 'car', 'Saab', '900', 'DW 00126', 'YS33CD42S71234567', 1996, 'available', '2026-07-10 11:09:55'),
(103, 'car', 'Fiat', 'Cinquecento', 'WB 00127', 'ZFA1700000S123456', 1994, 'available', '2026-07-10 11:09:55'),
(104, 'car', 'Skoda', 'Felicia', 'WX 00128', 'TMBEFF6Y3G1234567', 1997, 'available', '2026-07-10 11:09:55'),
(105, 'car', 'Daewoo', 'Tico', 'GD 00129', 'ULT1A12B3F1234567', 1997, 'service', '2026-07-10 11:09:55'),
(106, 'car', 'Daewoo', 'Lanos', 'SK 00130', 'ULT1E12B3F1234567', 1998, 'rented', '2026-07-10 11:09:55'),
(107, 'car', 'Seat', 'Ibiza II', 'PO 00131', 'VSSZZZ6KZWR123456', 1998, 'available', '2026-07-10 11:09:55'),
(108, 'car', 'Alfa Romeo', '156', 'KR 00132', 'ZAR93200001234567', 1999, 'available', '2026-07-10 11:09:55'),
(109, 'car', 'Rover', '75', 'LU 00133', 'SARRJWBHC1D123456', 2000, 'available', '2026-07-10 11:09:55'),
(110, 'car', 'Jaguar', 'S-Type', 'ZR 00134', 'SAJAA01C91F123456', 2001, 'rented', '2026-07-10 11:09:55'),
(111, 'car', 'Lexus', 'IS200', 'DW 00135', 'JCE10R20001234567', 2000, 'service', '2026-07-10 11:09:55'),
(112, 'car', 'Mini', 'Cooper R50', 'WB 00136', 'WMWRE30010T123456', 2002, 'available', '2026-07-10 11:09:55'),
(113, 'car', 'Smart', 'Fortwo', 'WX 00137', 'WME4510001K123456', 2003, 'available', '2026-07-10 11:09:55'),
(114, 'car', 'Volkswagen', 'Polo IV', 'GD 00138', 'WVWZZZ9NZ3U123456', 2003, 'available', '2026-07-10 11:09:55'),
(115, 'car', 'Fiat', 'Stilo', 'SK 00139', 'ZFA1920000S123456', 2004, 'rented', '2026-07-10 11:09:55'),
(116, 'car', 'Renault', 'Laguna II', 'PO 00140', 'VF1BG0B0536123456', 2005, 'available', '2026-07-10 11:09:55'),
(117, 'car', 'Peugeot', '307', 'KR 00141', 'VF33ARHR58L123456', 2005, 'service', '2026-07-10 11:09:55'),
(118, 'car', 'Citroen', 'C4', 'LU 00142', 'VF7LC4HPC7L123456', 2006, 'available', '2026-07-10 11:09:55'),
(119, 'car', 'Nissan', 'Qashqai', 'ZR 00143', 'SJNFAAJ10U1234567', 2007, 'available', '2026-07-10 11:09:55'),
(120, 'car', 'Ford', 'Fusion', 'DW 00144', 'WF0UXXGAJU7A12345', 2007, 'rented', '2026-07-10 11:09:55'),
(121, 'car', 'Opel', 'Corsa D', 'WB 00145', 'W0L0SDL688P123456', 2008, 'available', '2026-07-10 11:09:55'),
(122, 'car', 'Suzuki', 'Swift', 'WX 00146', 'TSMMZC32S00123456', 2009, 'available', '2026-07-10 11:09:55'),
(123, 'car', 'Renault', 'Twingo II', 'GD 00147', 'VF1CN0B0536123456', 2009, 'service', '2026-07-10 11:09:55'),
(124, 'car', 'Honda', 'Jazz', 'SK 00148', 'JHMGK38408S123456', 2008, 'available', '2026-07-10 11:09:55'),
(125, 'car', 'Toyota', 'Yaris', 'PO 00149', 'JT2KT32W4S0123456', 2010, 'rented', '2026-07-10 11:09:55'),
(126, 'car', 'Kia', 'Rio', 'KR 00150', 'U5YPC81DBGL123456', 2011, 'available', '2026-07-10 11:09:55'),
(127, 'car', 'Hyundai', 'Elantra', 'LU 00151', 'TMAJU31DBKJ123456', 2012, 'available', '2026-07-10 11:09:55'),
(128, 'car', 'Volkswagen', 'Up!', 'ZR 00152', 'WVWZZZ6RZCU123456', 2013, 'available', '2026-07-10 11:09:55'),
(129, 'car', 'Fiat', '500', 'DW 00153', 'ZFA3120000S123456', 2014, 'service', '2026-07-10 11:09:55'),
(130, 'car', 'Skoda', 'Fabia III', 'WB 00154', 'TMBJL6NE3F0123456', 2015, 'rented', '2026-07-10 11:09:55'),
(131, 'car', 'Seat', 'Leon III', 'WX 00155', 'VSSZZZ5FZGR123456', 2016, 'available', '2026-07-10 11:09:55'),
(132, 'car', 'Peugeot', '308 II', 'GD 00156', 'VF3L3AHR5HL123456', 2017, 'available', '2026-07-10 11:09:55'),
(133, 'car', 'Renault', 'Megane IV', 'SK 00157', 'VF1RFL006HL123456', 2018, 'available', '2026-07-10 11:09:55'),
(134, 'car', 'Citroen', 'C3 III', 'PO 00158', 'VF7SCHPZ6J1234567', 2019, 'rented', '2026-07-10 11:09:55'),
(135, 'car', 'Dacia', 'Sandero', 'KR 00159', 'UU1SDAH7R12345678', 2020, 'available', '2026-07-10 11:09:55'),
(136, 'car', 'Toyota', 'Aygo', 'LU 00160', 'JT2MB32W0S0123456', 2019, 'available', '2026-07-10 11:09:55'),
(137, 'truck', 'Star', '266', 'ZR 00161', 'STA26619870000061', 1987, 'available', '2026-07-10 11:09:55'),
(138, 'truck', 'Jelcz', '315', 'DW 00162', 'JEL31519900000062', 1990, 'service', '2026-07-10 11:09:55'),
(139, 'truck', 'Ursus', 'C-360', 'WB 00163', 'URSC3601985000006', 1985, 'available', '2026-07-10 11:09:55'),
(140, 'truck', 'Lublin', 'II', 'WX 00164', 'LUBII199400000064', 1994, 'rented', '2026-07-10 11:09:55'),
(141, 'truck', 'Tatra', '815', 'GD 00165', 'TAT81519870000065', 1987, 'available', '2026-07-10 11:09:55'),
(142, 'truck', 'MAN', 'F90', 'SK 00166', 'WMAF901992K123456', 1992, 'available', '2026-07-10 11:09:55'),
(143, 'truck', 'Mercedes', 'SK', 'PO 00167', 'WDBSK199512345678', 1995, 'service', '2026-07-10 11:09:55'),
(144, 'truck', 'Scania', '113', 'KR 00168', 'YS21131996K123456', 1996, 'rented', '2026-07-10 11:09:55'),
(145, 'truck', 'Volvo', 'F12', 'LU 00169', 'YVF12A19931234567', 1993, 'available', '2026-07-10 11:09:55'),
(146, 'truck', 'Renault', 'Magnum', 'ZR 00170', 'VF6MAG1998A123456', 1998, 'available', '2026-07-10 11:09:55'),
(147, 'motorcycle', 'Jawa', '350', 'DW 00171', 'JWA35019780000071', 1978, 'available', '2026-07-10 11:09:55'),
(148, 'motorcycle', 'SHL', 'M11', 'WB 00172', 'SHLM1119850000072', 1985, 'service', '2026-07-10 11:09:55'),
(149, 'motorcycle', 'WSK', '125', 'WX 00173', 'WSK12519800000073', 1980, 'available', '2026-07-10 11:09:55'),
(150, 'motorcycle', 'Simson', 'S51', 'GD 00174', 'SIMS5119870000074', 1987, 'available', '2026-07-10 11:09:55'),
(151, 'motorcycle', 'Yamaha', 'FZR 600', 'SK 00175', 'JYAFZR1991A123456', 1991, 'rented', '2026-07-10 11:09:55'),
(152, 'motorcycle', 'Honda', 'VFR 750', 'PO 00176', 'JHVFR1992B123456', 1992, 'available', '2026-07-10 11:09:55'),
(153, 'motorcycle', 'Suzuki', 'RF 900', 'KR 00177', 'JSRF91993C1234567', 1993, 'available', '2026-07-10 11:09:55'),
(154, 'motorcycle', 'Kawasaki', 'ZX-9R', 'LU 00178', 'JKZX91994D123456', 1994, 'service', '2026-07-10 11:09:55'),
(155, 'motorcycle', 'Ducati', '900 SS', 'ZR 00179', 'ZDM9001995E123456', 1995, 'available', '2026-07-10 11:09:55'),
(156, 'motorcycle', 'Moto Guzzi', 'California', 'DW 00180', 'ZGUCA1996F123456', 1996, 'rented', '2026-07-10 11:09:55'),
(157, 'bus', 'Autosan', 'H9', 'WB 00181', 'AUSH9198600000081', 1986, 'available', '2026-07-10 11:09:55'),
(158, 'bus', 'Jelcz', 'PR110', 'WX 00182', 'JELPR198812345678', 1988, 'service', '2026-07-10 11:09:55'),
(159, 'bus', 'Ikarus', '280', 'GD 00183', 'IKR28019790000083', 1979, 'available', '2026-07-10 11:09:55'),
(160, 'bus', 'Karosa', 'B732', 'SK 00184', 'KARB7321991123456', 1991, 'rented', '2026-07-10 11:09:55'),
(161, 'bus', 'Mercedes', 'O405', 'PO 00185', 'WDBO4051993123456', 1993, 'available', '2026-07-10 11:09:55'),
(162, 'bus', 'DAF', 'SB220', 'KR 00186', 'DAFSB199512345678', 1995, 'available', '2026-07-10 11:09:55'),
(163, 'bus', 'Scania', 'OmniCity', 'LU 00187', 'YSOMM20011234567', 2001, 'available', '2026-07-10 11:09:55'),
(164, 'bus', 'MAN', 'NL202', 'ZR 00188', 'WMANL199812345678', 1998, 'service', '2026-07-10 11:09:55'),
(165, 'car', 'Porsche', '944', 'DW 00189', 'WP0ZZZ94ZSN123456', 1990, 'rented', '2026-07-10 11:09:55'),
(166, 'car', 'Ferrari', 'Testarossa', 'WB 00190', 'ZFFSA17B000123456', 1988, 'available', '2026-07-10 11:09:55'),
(167, 'car', 'Lamborghini', 'Countach', 'WX 00191', 'ZHWLA21A3LA123456', 1989, 'available', '2026-07-10 11:09:55'),
(168, 'car', 'De Tomaso', 'Pantera', 'GD 00192', 'DTMPA19740000092', 1974, 'available', '2026-07-10 11:09:55'),
(169, 'car', 'Maserati', 'Biturbo', 'SK 00193', 'ZAM331B000S123456', 1987, 'service', '2026-07-10 11:09:55'),
(170, 'car', 'Lancia', 'Delta HF', 'PO 00194', 'ZLA831AB0MS123456', 1991, 'rented', '2026-07-10 11:09:55'),
(171, 'car', 'Alpine', 'A110', 'KR 00195', 'ALPA1101973000009', 1973, 'available', '2026-07-10 11:09:55'),
(172, 'car', 'Triumph', 'Spitfire', 'LU 00196', 'TRUSP19760000096', 1976, 'available', '2026-07-10 11:09:55'),
(173, 'car', 'MG', 'B GT', 'ZR 00197', 'MGBGT19750000097', 1975, 'available', '2026-07-10 11:09:55'),
(174, 'car', 'Fiat', '131 Mirafiori', 'DW 00198', 'FIA13119810000098', 1981, 'rented', '2026-07-10 11:09:55'),
(175, 'car', 'Opel', 'Rekord E', 'WB 00199', 'OPLREK19830000099', 1983, 'service', '2026-07-10 11:09:55'),
(176, 'car', 'Mercedes', 'W116', 'WX 00200', 'WDB11619780000100', 1978, 'available', '2026-07-10 11:09:55'),
(177, 'truck', 'Iveco', 'Daily', 'GWE 293W2', 'WMA227ZZZHP223456', 2001, 'service', '2026-07-10 11:40:18'),
(178, 'motorcycle', 'Suzuki', 'gsx600', 'GWE 421W', ' 	ZDMH450AAMB1234', 2020, 'available', '2026-07-10 11:49:57'),
(179, 'truck', 'iveco', 'daily', 'GWE 293W5', 'WMA227ZZZHD223456', 2025, 'service', '2026-07-10 11:51:56'),
(180, 'bus', 'Solaris', 'obuza', 'GWEFIJOI#58305', 'WMA227ZZZHD223456', 2026, 'rented', '2026-07-10 11:52:39');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `vehicle_history`
--

CREATE TABLE `vehicle_history` (
  `id` int(11) NOT NULL,
  `vehicle_id` int(11) DEFAULT NULL,
  `action` enum('rent','return','service','finishService','delete') NOT NULL,
  `old_status` varchar(20) DEFAULT NULL,
  `new_status` varchar(20) DEFAULT NULL,
  `changed_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `vehicle_history`
--
ALTER TABLE `vehicle_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_id` (`vehicle_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT for table `vehicle_history`
--
ALTER TABLE `vehicle_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
