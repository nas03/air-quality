export class WindData {
    constructor(
        public id: number,
        public ugrid_data: number[],
        public vgrid_data: number[],
        public timestamp: Date,
    ) {}
}
