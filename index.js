const fs = require('fs');
const brs = require('./build/brs.js');

/** Class representing a UUID */
class Uuid extends String
{
}

/** Class representing a datetime */
class DateTime extends String
{
}

/** Class representing a color */
class Color extends Number
{
}

// oof
const defaultColors = [4294967295, 4287137928, 4284045657, 4281940281, 4280492835, 4279308561, 4278584838, 4278190080, 4283893001, 4293527046, 4294330630, 4293565702, 4278749701, 4278491306, 4288881493, 4284092983, 4279632897, 4281406477, 4284026884, 4287642642, 4289095742, 4294942542, 4290945850, 4294946607, 4278522373, 4278525442, 4279575552, 4278209536, 4278924810, 4282601228, 4294939146, 4285349893, 4278853163, 4280166185, 4282866784, 4286819509, 4283470754, 4278744776, 4278206586, 4278264384, 2583629326, 2583677957, 2568982546, 2569766333, 2572616969, 2583054598, 2567449359, 2583691263, 2583691263, 2575861896, 2572769625, 2570664249, 2569216803, 2568032529, 2567308806, 2566914048].map(function(e) {return new Color(e);});

/** Class representing a User */
class User
{
    /**
     * Create a User
     * @param {Uuid} id - ID
     * @param {String} name - Name
     */
    constructor(id, name)
    {
        this.id = id || new Uuid('00000000-0000-0000-0000-000000000000');
        this.name = name || '';
    }
}

const Direction = {
    XPositive: 'XPositive',
    XNegative: 'XNegative',
    YPositive: 'YPositive',
    YNegative: 'YNegative',
    ZPositive: 'ZPositive',
    ZNegative: 'ZNegative',
};

const Rotation = {
    Deg0: 'Deg0',
    Deg90: 'Deg90',
    Deg180: 'Deg180',
    Deg270: 'Deg270',
};

/** Class representing a ColorMode */
class ColorMode
{
    /**
     * Creates a new ColorMode
     * @param {Number} set - A color from the lookup table
     * @param {Color} custom - A custom color
     */
    constructor(set, custom)
    {
        if (set !== undefined)
            this.Set = set;
        if (custom !== undefined)
            this.Custom = custom;
    }

    /**
     *  Creates a new ColorMode with a color from the lookup table
     * @param {Number} index - Index of color
     * @return {ColorMode}
     */
    static fromSet(index)
    {
        return new this(index);
    }

    /**
     *  Creates a new ColorMode with a color from the lookup table
     * @param {Color} custom - Index of color
     * @return {ColorMode}
     */
    static fromCustom(custom)
    {
        return new this(undefined, custom);
    }
}

/** Class representing a brick */
class Brick
{
    /**
     * Create new brick
     * @param {Number} assetNameIndex - Index of asset name
     * @param {{Number}[]} size - Size
     * @param {{Number}[]} position - Position
     * @param {Direction} direction - Direction
     * @param {Rotation} rotation - Rotation
     * @param {Boolean} collision - Collision
     * @param {Boolean} visibility - Visibility
     * @param {Number} materialIndex - Index of material
     * @param {ColorMode} color - Index of color
     * @param {Number} ownerIndex - Index of owner
     */
    constructor(assetNameIndex, size, position, direction, rotation, collision, visibility, materialIndex, color, ownerIndex)
    {
        this.asset_name_index = assetNameIndex || 0;
        this.size = size || [0, 0, 0];
        this.position = position || [0, 0, 0];
        this.direction = direction || Direction.ZPositive;
        this.rotation = rotation || Rotation.Deg0;
        this.collision = collision || true;
        this.visibility = visibility || true;
        this.material_index = materialIndex || 2;
        this.color = color || new ColorMode(0);
        this.owner_index = ownerIndex || 0;
    }
}

/** Class representing save file data */
class WriteData
{
    /**
     * Create new save data
     * @param {String} map - The name of the map that the save file was created on.
     * @param {User} author - The user that created the save.
     * @param {String} description - A short description of the save file.
     * @param {DateTime} saveTime - When the save file was created.
     * @param {{String}[]} mods - The mods used by the save file. Format not yet defined.
     * @param {{String}[]} brickAssets - The name lookup table used by bricks. Example values include:
     * `"PB_DefaultBrick"`, `"PB_DefaultTile"`, `"B_1x_Octo_T"`, etc.
     * @param {{Color}[]} colors - The color lookup table used by bricks.
     * @param {{String}[]} materials - The material lookup table used by bricks. Common values include:
     * - `"BMC_Plastic"`
     * - `"BMC_Glow"`
     * - `"BMC_Metallic"`
     * - `"BMC_Hologram"`
     * @param {{User}[]} brickOwners - The brick owner lookup table used by bricks.
     * @param {{Brick}[]} bricks - All the bricks in the save file
     */
    constructor(map, author, description, saveTime, mods, brickAssets, colors, materials, brickOwners, bricks)
    {
        this.map = map || 'Plate';
        this.author = author || new User();
        this.description = description || '';
        this.save_time = saveTime || new DateTime('1970-01-01T00:00:00+00:00');

        this.mods = mods || [];
        this.brick_assets = brickAssets || ['PB_DefaultBrick'];

        this.colors = colors || defaultColors;
        this.materials = materials || [
            'BMC_Ghost',
            'BMC_Ghost_Fail',
            'BMC_Plastic',
            'BMC_Glow',
            'BMC_Metallic',
            'BMC_Hologram',
        ];
        this.brick_owners = brickOwners || [];

        this.bricks = bricks || [];
    }
}

/**
 * Writes save to file
 * @param {String} filename - Path of file to write to
 * @param {WriteData} writeData - Save data to write
 */
function writeSave(filename, writeData)
{
    return brs.write_save_from_js_to_file(writeData || new WriteData(), filename);
};

/**
 * Read save file
 * @param {String} filename - Path of file to read
 * @return {WriteData}
 */
function readSave(filename)
{
    const data = brs.read_save_from_js_from_file(filename);
    return parseData(data);
}

/**
 * Read save file from buffer
 * @param {Buffer} buffer - Buffer with file data
 * @return {WriteData}
 */
function readSaveBuffer(buffer) {
    const data = brs.read_save_from_js([...buffer]); // Nothing else worked
    return parseData(data);
}

function parseData(data) {
    data.colors = data.colors.map(function(e)
    {
        return new Color(e);
    });
    data.brick_owners = data.brick_owners.map(function(e)
    {
        return new User(e.id, e.name);
    });
    data.bricks = data.bricks.map(function(e)
    {
        return new Brick(
            e.asset_name_index,
            e.size,
            e.position,
            e.direction,
            e.rotation,
            e.collision,
            e.visibility,
            e.material_index,
            new ColorMode(e.color.Set, e.color.Custom),
            e.owner_index
        );
    });

    return new WriteData(
        data.map,
        new User(
            new Uuid(data.author.id),
            data.author.name
        ),
        data.description,
        new DateTime(data.save_time),
        data.mods,
        data.brick_assets,
        data.colors,
        data.materials,
        data.brick_owners,
        data.bricks
    );
}

module.exports = {

    WriteData: WriteData,
    Brick: Brick,
    ColorMode: ColorMode,
    Rotation: Rotation,
    Direction: Direction,
    User: User,
    Color: Color,
    DateTime: DateTime,
    Uuid: Uuid,

    // Functions

    writeSave: writeSave,
    readSave: readSave,
    readSaveBuffer: readSaveBuffer
};
