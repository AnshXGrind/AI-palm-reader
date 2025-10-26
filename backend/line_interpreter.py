def interpret_lines(lines):
    """Very small rule-based line interpreter for prototype.

    Input: lines - list of {coords: [x1,y1,x2,y2], length: int}
    Output: human-friendly string with short observations.
    """
    if not lines:
        return "No prominent lines detected. Try a clearer photo with good lighting and the whole palm visible."

    total_length = sum(l["length"] for l in lines)

    observations = []

    # General vitality heuristic
    if total_length > 1200:
        observations.append("Your palm shows longer, more pronounced lines — often associated with vitality and decisiveness.")
    else:
        observations.append("Finer or fewer long lines — suggests introspection and adaptability.")

    # Simple heart line heuristic: top-most fairly horizontal long line
    horizontals = []
    for l in lines:
        x1, y1, x2, y2 = l["coords"]
        dx = abs(x2 - x1)
        dy = abs(y2 - y1)
        if dx > 60 and dy < 30:
            horizontals.append((y1 + y2) / 2)

    if horizontals:
        top_mean = min(horizontals)
        observations.append("A clear top horizontal line (Heart line) — indicates emotional clarity and expressive relationships.")
    else:
        observations.append("A subtle or broken Heart line — you may be guarded with emotions or private about feelings.")

    # Head/Life crude heuristic: look for vertical-ish curves (here we approximate by slope)
    verticals = 0
    for l in lines:
        x1, y1, x2, y2 = l["coords"]
        dx = abs(x2 - x1)
        dy = abs(y2 - y1)
        if dy > dx and dy > 50:
            verticals += 1

    if verticals >= 2:
        observations.append("Multiple vertical-ish lines — you might have complex life events or strong responsibility markers.")
    else:
        observations.append("Single/soft vertical lines — life path appears steady and focused.")

    # Concatenate into friendly paragraph
    return "\n".join(observations)
