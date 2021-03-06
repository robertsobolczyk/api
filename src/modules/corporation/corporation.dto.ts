import { DAllianceShort } from '../alliance/alliance.dto';
import { Corporation } from './corporation.entity';
import { DPagination } from '../core/pagination/paggination.dto';
import { ICorporationIcon } from './corporation.interface';
import { ApiModelProperty } from '@nestjs/swagger';
import { DFollow } from '../follow/follow.dto';
import { Follow } from '../follow/follow.entity';

export class DCorporationIcon {
  @ApiModelProperty()
  px64x64: string;
  @ApiModelProperty()
  px128x128: string;
  @ApiModelProperty()
  px256x256: string;

  constructor(icon: ICorporationIcon) {
    this.px64x64 = icon.px64x64;
    this.px128x128 = icon.px128x128;
    this.px256x256 = icon.px256x256;
  }
}

export class DCorporationShort {
  @ApiModelProperty()
  id: number;
  @ApiModelProperty()
  handle: string;
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  ticker: string;
  @ApiModelProperty()
  description: string;
  @ApiModelProperty()
  alliance?: DAllianceShort;
  @ApiModelProperty()
  icon: DCorporationIcon;

  constructor(corporation: Corporation) {
    this.id = corporation.id;
    this.handle = corporation.handle;
    this.name = corporation.name;
    this.ticker = corporation.ticker;
    this.description = corporation.description;
    this.alliance = corporation.alliance ? new DAllianceShort(corporation.alliance) : null;
    this.icon = new DCorporationIcon(corporation.icon);
  }
}

export class DCorporationShortWithoutAlliance {
  @ApiModelProperty()
  id: number;
  @ApiModelProperty()
  handle: string;
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  ticker: string;
  @ApiModelProperty()
  description: string;
  @ApiModelProperty()
  icon: DCorporationIcon;

  constructor(corporation: Corporation) {
    this.id = corporation.id;
    this.handle = corporation.handle;
    this.name = corporation.name;
    this.ticker = corporation.ticker;
    this.description = corporation.description;
    this.icon = new DCorporationIcon(corporation.icon);
  }
}

export class DCorporation {
  @ApiModelProperty()
  id: number;
  @ApiModelProperty()
  handle: string;
  @ApiModelProperty()
  name: string;
  @ApiModelProperty()
  ticker: string;
  @ApiModelProperty()
  description: string;
  @ApiModelProperty()
  alliance?: DAllianceShort;
  @ApiModelProperty()
  icon: DCorporationIcon;
  @ApiModelProperty()
  followers: DFollow[];
  @ApiModelProperty()
  numPosts: number;

  constructor(corporation: Corporation, followers: Follow[], numPosts: number) {
    this.id = corporation.id;
    this.handle = corporation.handle;
    this.name = corporation.name;
    this.ticker = corporation.ticker;
    this.description = corporation.description;
    this.alliance = corporation.alliance ? new DAllianceShort(corporation.alliance) : null;
    this.icon = new DCorporationIcon(corporation.icon);
    this.followers = followers.map(follow => new DFollow(follow));
    this.numPosts = numPosts;
  }
}

export class DCorporationList extends DPagination<DCorporationShort> {
  constructor(corporations: Corporation[], page: number, perPage: number, count: number) {
    const formattedCorporations = corporations.map(
      corporation => new DCorporationShort(corporation));
    super(formattedCorporations, page, perPage, count);
  }
}
