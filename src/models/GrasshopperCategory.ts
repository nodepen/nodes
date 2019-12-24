export default interface GrasshopperCategory {
    name: string;
    subCategories: {
      name: string;
      components: {
        name: string;
      }[];
    }[];
  }