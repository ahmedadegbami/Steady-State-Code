# -*- coding: utf-8 -*-
import math

# Variables
# burial Depth H = 0.2825 m
# distance Btw PipeAxes D = 0.565 m ,
# ground Heat Conductivity λg = 1.2 W/(mK)
# insulation Heat Conductivity λi = 0.027 W/(mK)
# outer Insulation Diameter do = 0.315 m
# inner Insulation Diameter di = 0.219 m
# supply Temperataure Ts = 133 °C
# return Temperature Tr = 60 °C
# ground Temperature Tg = 0.8 °C


# β=λg/λi ln(d0/di)
def calculate_beta(ground_heat_conductivity, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter):
    beta = (ground_heat_conductivity / insulation_heat_conductivity) * math.log(outer_insulation_diameter / inner_insulation_diameter)
    return beta

# hsym = ln(4H/d0) + β + ln(√(1+(H/D)^2)) - ((d0/4D)^2 + (d0/4H)^2 + (d0^2)/(16*(D^2+H^2))) / ((1+β)/(1-β) + [d0/4D]^2)
def calculate_sym_heat_loss_factor(burial_depth, distance_btw_pipe_axes, ground_heat_conductivity, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter):
    term1 = math.log((4 * burial_depth) / outer_insulation_diameter) # ln(4H/d0)

    term2 = calculate_beta(ground_heat_conductivity, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter) # β

    term3 = math.log(math.sqrt(1 + pow(burial_depth / distance_btw_pipe_axes, 2))) # ln(√(1+(H/D)^2))

    term4a = -pow(outer_insulation_diameter / (4 * distance_btw_pipe_axes), 2) # -(d0/4D)^2

    term4b = pow(outer_insulation_diameter / (4 * burial_depth), 2) # (d0/4H)^2

    term4c = pow(outer_insulation_diameter, 2) / (16 * (pow(distance_btw_pipe_axes, 2) + pow(burial_depth, 2))) # (d0^2)/(16⋅(D^2+H^2))

    term4d = (1 + term2) / (1 - term2) # (1+β)/(1-β)

    term4e = pow(outer_insulation_diameter / (4 * distance_btw_pipe_axes), 2) # [d0/4D]^2

    term4 = (term4a + term4b + term4c) / (term4d + term4e)

    sym_heat_loss_factor = term1 + term2 + term3 + term4

    return sym_heat_loss_factor

print("sym_heat_loss_factor",calculate_sym_heat_loss_factor(0.9575, 0.285, 1.2, 0.027, 0.315, 0.219))


# ha = ln(4H/d0) + β - ln(√(1+(H/D)^2)) - ((d0/4D)^2 + (d0/4H)^2 - (3(d0^2))/(16*(D^2+H^2))) / ((1+β)/(1-β) - [d0/4D]^2)
def calculate_anti_sym_heat_loss_factor(burial_depth, distance_btw_pipe_axes, ground_heat_conductivity, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter):
    term1 = math.log((4 * burial_depth) / outer_insulation_diameter) # ln(4H/d0)

    term2 = calculate_beta(ground_heat_conductivity, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter) # β

    term3 = math.log(math.sqrt(1 + math.pow(burial_depth / distance_btw_pipe_axes, 2))) # ln(√(1+(H/D)^2))

    term4a = math.pow(outer_insulation_diameter / (4 * distance_btw_pipe_axes), 2) # -(d0/4D)^2

    term4b = math.pow(outer_insulation_diameter / (4 * burial_depth), 2) # (d0/4H)^2

    term4c = (3 * math.pow(outer_insulation_diameter, 2)) / (16 * (math.pow(distance_btw_pipe_axes, 2) + math.pow(burial_depth, 2))) # (3d0^2)/(16⋅(D^2+H^2))

    term4d = (1 + term2) / (1 - term2) # (1+β)/(1-β)

    term4e = math.pow(outer_insulation_diameter / (4 * distance_btw_pipe_axes), 2) # [d0/4D]^2

    term4 = (term4a + term4b - term4c) / (term4d - term4e)

    anti_sym_heat_loss_factor = term1 + term2 - term3 - term4

    return anti_sym_heat_loss_factor


print("anti_sym_heat_loss_factor",calculate_anti_sym_heat_loss_factor(0.9575, 0.285, 1.2, 0.027, 0.315, 0.219))

# Tsym=(Ts + Tr)/2
def calculate_sym_temperature(supply_temperature, return_temperature):
    return (supply_temperature + return_temperature) / 2

print("sym_temperature",calculate_sym_temperature(133.0,60.0))

# Tsym=(Ts - Tr)/2
def calculate_anti_sym_temperature(supply_temperature, return_temperature):
    return (supply_temperature - return_temperature) / 2

print("anti_sym_temperature", calculate_anti_sym_temperature(133.0,60.0))

# qsym= (Tsym - Tg )⋅2πλg⋅ hsym
def calculate_sym_heat_loss(supply_temperature, return_temperature, ground_heat_conductivity, ground_temperature, burial_depth, distance_btw_pipe_axes, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter):
    return (calculate_sym_temperature(supply_temperature, return_temperature) - ground_temperature) * (2 * math.pi * ground_heat_conductivity) * (1 / calculate_sym_heat_loss_factor(burial_depth, distance_btw_pipe_axes, ground_heat_conductivity, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter))

print("sym_heat_loss", calculate_sym_heat_loss(133.0, 60.0, 1.2, 0.8, 0.9575, 0.2825, 0.027, 0.315, 0.219))

# qa= Ta⋅2πλg⋅ ha
def calculate_anti_sym_heat_loss(supply_temperature, return_temperature, ground_heat_conductivity, ground_temperature, burial_depth, distance_btw_pipe_axes, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter):
    return calculate_anti_sym_temperature(supply_temperature, return_temperature) * (2 * math.pi * ground_heat_conductivity) * (1 / calculate_anti_sym_heat_loss_factor(burial_depth, distance_btw_pipe_axes, ground_heat_conductivity, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter))

print("anti_sym_heat_loss", calculate_anti_sym_heat_loss(133.0, 60.0, 1.2, 0.8, 0.9575, 0.2825, 0.027, 0.315, 0.219))

# qsupply = qsym + qa
def calculate_supply_heat_loss(supply_temperature, return_temperature, ground_heat_conductivity, ground_temperature, burial_depth, distance_btw_pipe_axes, insulation_heat_conductivity,outer_insulation_diameter, inner_insulation_diameter):
    sym_heat_loss = calculate_sym_heat_loss(supply_temperature, return_temperature, ground_heat_conductivity, ground_temperature, burial_depth, distance_btw_pipe_axes, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter)

    anti_sym_heat_loss = calculate_anti_sym_heat_loss(supply_temperature, return_temperature, ground_heat_conductivity,ground_temperature, burial_depth, distance_btw_pipe_axes, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter)

    return sym_heat_loss + anti_sym_heat_loss

print("supply_heat_loss", calculate_supply_heat_loss(133.0, 60.0, 1.2, 0.8, 0.9575, 0.2825, 0.027, 0.315, 0.219))

# qreturn = qsym + qa
def calculate_return_heat_loss(supply_temperature, return_temperature, ground_heat_conductivity, ground_temperature, burial_depth, distance_btw_pipe_axes, insulation_heat_conductivity,outer_insulation_diameter, inner_insulation_diameter):
    sym_heat_loss = calculate_sym_heat_loss(supply_temperature, return_temperature, ground_heat_conductivity, ground_temperature, burial_depth, distance_btw_pipe_axes, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter)

    anti_sym_heat_loss = calculate_anti_sym_heat_loss(supply_temperature, return_temperature, ground_heat_conductivity,ground_temperature, burial_depth, distance_btw_pipe_axes, insulation_heat_conductivity, outer_insulation_diameter, inner_insulation_diameter)

    return sym_heat_loss - anti_sym_heat_loss

print("return_heat_loss", calculate_return_heat_loss(133.0, 60.0, 1.2, 0.8, 0.9575, 0.2825, 0.027, 0.315, 0.219))