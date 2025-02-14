import $ from "jquery";
import { RenderHTML } from "../../../.storybook/setup.js";
import AutotocComponent from "./autotoc.js";

export default {
    title: "Patterns/Autotoc",
};

const getAutotoc = () => `
  <div class="pat-autotoc" data-pat-autotoc="scrollDuration:slow;levels:h4,h5,h6;">
      <h4>Title 1</h4>
      <p>
          Mr. Zuckerkorn, you've been warned about touching. You said spanking. It walked
          on my pillow! How about a turtle? I've always loved those leathery little snappy
          faces.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.
      </p>
      <h5>Title 1.1</h5>
      <p>
          Ah coodle doodle do Caw ca caw, caw ca caw. Butterscotch!

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

      </p>
      <h6>Title 1.1.1</h6>
      <p>
          Want a lick? Okay, Lindsay, are you forgetting that I was a professional twice
          over - an analyst and a therapist.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

      </p>
      <h4>Title 2</h4>
      <p>
          You boys know how to shovel coal? Don't worry, these young beauties have been
          nowhere near the bananas. I thought the two of us could talk man-on-man.
          
          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.

          Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
          homero facilisis in cum. At doming voluptua indoctum mel, natum noster
          similique ne mel.          
      </p>
      <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br />
  </div>
`;

export const Autotoc = {
    render: () => RenderHTML({}, getAutotoc),
};

const getAutotocTabs = () => `
  <div class="pat-autotoc autotabs" data-pat-autotoc="section:fieldset;levels:legend;">
      <fieldset>
          <legend>Tab 1</legend>
          <div>
              Lorem ipsum dolor sit amet, ex nam odio ceteros fastidii, id porro lorem pro,
              homero facilisis in cum. At doming voluptua indoctum mel, natum noster
              similique ne mel.
          </div>
      </fieldset>
      <fieldset>
          <legend>Tab 2</legend>
          <div>
              Reque repudiare eum et. Prompta expetendis percipitur eu eam, et graece
              mandamus pro, eu vim harum audire tractatos. Ad perpetua salutandi mea,
              soluta delicata aliquando eam ne. Qui nostrum lucilius perpetua ut, eum suas
              stet oblique ut.
          </div>
      </fieldset>
      <fieldset>
          <legend>Tab 3</legend>
          <div>
              Vis mazim harum deterruisset ex, duo nemore nostro civibus ad, eros
              vituperata id cum. Vim at erat solet soleat, eum et iuvaret luptatum, pro an
              esse dolorum maiestatis.
          </div>
      </fieldset>
  </div>
`;

export const AutotocTabs = {
    render: () => RenderHTML({}, getAutotocTabs),
};
